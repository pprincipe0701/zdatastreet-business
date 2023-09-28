const cds = require('@sap/cds');
const circularJSON = require('circular-json');
const { MovimientoDiarioCustom, Establecimientos, MovimientosDiarios, MasterTicket} = cds.entities;

/** Service implementation for CatalogService */
module.exports = cds.service.impl(srv => {
    srv.after('READ', 'MovimientoDiarioCustom', (data) => _updateContentList(data));
    srv.on('CREATE', 'MovimientoDiarioCustom', saveMovDiario);
    //Sobreescribir cualquier error desconocido
    srv.on("error", (err, req) => {
        console.info('error_reqxx :: ', req.entity);
        console.info('error_reqx_2 :: ', err.message);
        let arrKeyError = err.message.split('--');
        console.info('error_reqx_3 :: ', arrKeyError);
        let codeMessage = arrKeyError[0];
        console.info('error_reqx_4 :: ', codeMessage);
        let codeMessageMap = err.message + '_' + req.entity;
        if(!isEmpty(arrKeyError[1])) {
            codeMessageMap = codeMessage + '_' + arrKeyError[1];
        }
        console.info('error_reqx_5 :: ', codeMessageMap);
        let map = new Map();
        //map.set('UNIQUE_CONSTRAINT_VIOLATION_ZcapacitacionService.Courses', 'Clave primaria de Curso duplicada');
        //map.set('UNIQUE_CONSTRAINT_VIOLATION_TuitionCustom', 'Clave primaria de matricula duplicada');   

        map.set('ENTITY_ALREADY_EXISTS_ZbusinessService.Establecimientos', 'Un Establecimiento con el mismo distrito, Zona, Razón social y Dirección ya se encuentra registrado');
        map.set('ENTITY_ALREADY_EXISTS_ZbusinessService.MovimientosDiarios', 'El movimiento diario con esos datos ya se encuentra registrado, por favor intente otra combinación o ingrese un nuevo registro');
        //map.set('ENTITY_ALREADY_EXISTS_ZcapacitacionService.TuitionCustom', 'Dni que desea registrar ya esta asignado a otro Participante'); 

        switch (codeMessage) {
            case "UNIQUE_CONSTRAINT_VIOLATION":
                console.info('error_req_2 :: ');
                err.message = map.get(codeMessageMap);
                break;
            case "ENTITY_ALREADY_EXISTS":
                console.info('error_req_3 :: ');
                err.message = map.get(codeMessageMap);
                break;
            default:
                console.info('error_req_4 :: ');
                err.message =
                    "" +
                    err.message;
                break;
        }

    });


});
/** Add some discount for overstocked books */
async function _updateContentList(data) {
    console.debug('>>>x');
    const movs = Array.isArray(data) ? data : [data];
    console.info('>>>x_yz', movs);
    /*
    risks.forEach((risk) => {
      if (risk.impact >= 100000) {
        risk.criticality = 1;
      } else { 
        risk.criticality = 2;
      }
   });*/
}

async function saveMovDiario(req) {
    //const { Items: orderItems } = req.data
    let data = req.data;
    console.info('saveMovDiario_1: ', data);
    let code = '200', status = 200, message = 'Los datos se grabaron exitosamente';
    /*new Promise(function (resolve, reject) {
				
    }.bind(this)).then(
        function (actaConformidad) {
            
        }.bind(this),
        function (msg) {
            MessageBox.error("Se guardaron los datos pero sin una Acta de conformidad.");
        }
    );*/
    let establecimientoAux = '';
    let movimientoDiarioAux = {};
    try {
        console.info('saveMovDiario_2: ');
        const tx = cds.transaction(req);
        let establecimientoAux = {
            razonSocial: data.razonSocial,
            direccion: data.direccion,
            horarioApertura: data.horarioApertura,
            horarioCierre: data.horarioCierre,
            otroRubro: data.otroRubro,
            coordenada: data.coordenada,
            masterRubro_ID: data.idRubro,
            masterDistrito_ID: data.idDistrito,
            masterZona_ID:data.idMasterZona
        };
        let idEstablecimiento = '';
        entidadAux = 'ZbusinessService.Establecimientos';
        if (isEmpty(data.idEstablecimiento)) {
            console.info('saveMovDiario_3: ');
            const [establecimientoOut] = await tx.run(INSERT.into(Establecimientos).entries(establecimientoAux));
            idEstablecimiento = establecimientoOut.ID;
            const jsonx = circularJSON.stringify(establecimientoOut);
            console.info('saveMovDiario_3_1: ' + jsonx);
        } else {
            console.info('saveMovDiario_4: ');
            await tx.run(UPDATE(Establecimientos).set(establecimientoAux).where({ ID: data.idEstablecimiento }));
            idEstablecimiento = data.idEstablecimiento;
        }

        //Grabar movimiento diario
        let today = new Date(new Date().toUTCString());
        today.setHours(today.getHours() - 5);
        console.info(today.toString());
        let fechaRegistro = today.toISOString().slice(0, 10);
        let horaRegistro = today.getHours() + ":" + today.getMinutes();
        let idUsuario = data.idUsuario;
        if(!isEmpty(data.codigoTicket)) {
            let masterTicket = await SELECT.one.from(MasterTicket).where({ codigoTicket: data.codigoTicket}); 
            fechaRegistro = masterTicket.fechaRegistro;
            horaRegistro = masterTicket.horaRegistro;
            idUsuario = masterTicket.masterUsuario_ID;
        }

        console.info('saveMovDiario_4_1 :: ' + fechaRegistro);
        console.info('saveMovDiario_4_2 :: ' + horaRegistro);
        console.info('saveMovDiario_4_2_1 :: ' + idUsuario);
        console.info('saveMovDiario_4_2_2 :: ' + data.codigoTicket);

        //Verificar si para el registro del mismo establecimiento ya paso como minimo media hora con respecto al ultimo registro hecho por un registrador
        /*let movDiarioLast = await SELECT.one.from(MovimientosDiarios).where({ establecimiento_ID: idEstablecimiento,masterAfluencia_ID:data.idAfluencia,masterTipoPublico_ID:data.idTipoPublico,
             masterEstacionTemporada_ID:data.idEstacionTemporada, masterUsuario_ID:data.idUsuario, fechaRegistro:fechaRegistro }).orderBy({ref:['createdAt'],sort:'desc'});*/
        let movDiarioLast = await SELECT.one.from(MovimientosDiarios).where({ establecimiento_ID: idEstablecimiento,masterUsuario_ID:idUsuario}).orderBy({ref:['createdAt'],sort:'desc'});
        
        if(movDiarioLast != null) {
            console.info('movDiarioLast__last1_horaultima_horaactual :: ' + movDiarioLast.horaRegistro + ' - ' + horaRegistro );
            let arrHoraLast = movDiarioLast.horaRegistro.split(':');
            let horaAuxLast = parseInt(arrHoraLast[0])*60;
            let minutoAuxLast = parseInt(arrHoraLast[1]);
            minutoAuxLast = horaAuxLast + minutoAuxLast;

            let arrHoraCurrent = horaRegistro.split(':');
            let horaAuxCurrent = parseInt(arrHoraCurrent[0])*60;
            let minutoAuxCurrent = parseInt(arrHoraCurrent[1]);
            minutoAuxCurrent = horaAuxCurrent + minutoAuxCurrent;
            let diffMinutos = minutoAuxCurrent - minutoAuxLast;
            console.info('movDiarioLast__last_current_diff_minutos__ :: ' + diffMinutos);
            entidadAux = '';
            if(diffMinutos < 20) {
                console.info('diferencia__ :: ' + diffMinutos);
                //throw { "Error": "No puede registrar movimiento de el mismo establecimiento antes de 20 minutos despues de registrado el ultimo movimiento" };
                //throw { "Error": "No puede registrar movimiento de el mismo establecimiento antes de 20 minutos despues de registrado el ultimo movimiento" };
                throw "No puede registrar movimiento del mismo establecimiento y del mismo registrador hasta despues de 20 minutos";
            }

        }
        
        entidadAux = 'ZbusinessService.MovimientosDiarios';

        movimientoDiarioAux = {
            razonSocial: data.razonSocial,
            direccion: data.direccion,
            horarioApertura: data.horarioApertura,
            horarioCierre: data.horarioCierre,
            otroRubro: data.otroRubro,
            coordenada: data.coordenada,
            masterRubro_ID: data.idRubro,
            masterDistrito_ID: data.idDistrito,
            establecimiento_ID: idEstablecimiento,
            masterAfluencia_ID: data.idAfluencia,
            masterTipoPublico_ID: data.idTipoPublico,
            masterEstacionTemporada_ID: data.idEstacionTemporada,
            masterNivelCompetencia_ID: data.idNivelCompetencia,
            registrador: data.registrador,
            fechaRegistro: fechaRegistro,
            horaRegistro: horaRegistro,
            flagFinanciera: data.flagFinanciera,
            obsFinanciera: data.obsFinanciera,
            flagCentroEducativo: data.flagCentroEducativo,
            obsCentroEducativo: data.obsCentroEducativo,
            flagCentroSalud: data.flagCentroSalud,
            obsCentroSalud: data.obsCentroSalud,
            flagIglesia: data.flagIglesia,
            obsIglesia: data.obsIglesia,
            flagAlquiler: data.flagAlquiler,
            obsAlquiler: data.obsAlquiler,
            status:data.status,
            observacionGeneral: data.observacionGeneral,
            codigoTicket: data.codigoTicket
        };
        console.info('saveMovDiario_5: ');
        //Registrar movimiento
        const [movDiariOut] = await tx.run(INSERT.into(MovimientosDiarios).entries(movimientoDiarioAux));
        movimientoDiarioAux.idMovimientoDiario = movDiariOut.ID;
        console.info('saveMovDiario_6: ' + movDiariOut.ID);
        
    } catch (error) {
        console.log('saveMovDiario_7x: ' + error);
        //throw{error};
        let errorMsg = error + '--' + entidadAux;
        errorMsg = errorMsg.replace('Error: ', '');
        console.log('saveMovDiario_7_1x : ' , errorMsg);
        return req.error({ code: "409", message: errorMsg, target: 'some_field', status: 409 });
    }
    console.info('saveMovDiario_8: ');
   req.reply (movimientoDiarioAux);
    





}

//Utilities
function isEmpty(inputStr) {

    var flag = false;
    if (inputStr === '') {
        flag = true;
    }
    if (inputStr === null) {
        flag = true;
    }
    if (inputStr === undefined) {
        flag = true;
    }
    if (inputStr == null) {
        flag = true;
    }

    return flag;
}