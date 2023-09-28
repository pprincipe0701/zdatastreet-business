using {nebula.com as rm} from '../db/schema';

@path : 'service/zbusiness'
service ZbusinessService {
    //entity Establecimientos       as projection on rm.Establecimientos;
    entity MovimientosDiarios     as projection on rm.MovimientosDiarios;
    entity MasterTicket   as projection on rm.MasterTicket;
    entity MovimientoDiarioCustom as
        select from rm.MovimientosDiarios as m
        inner join rm.Establecimientos as e
            on m.establecimiento.ID = e.ID
        {
            m.ID                         as idMovimientoDiario,
            m.razonSocial,
            m.direccion,
            m.horarioApertura,
            m.horarioCierre,
            m.otroRubro,
            m.coordenada, 
            m.masterRubro.ID             as idRubro,
            m.masterRubro.description   as descripcionRubro, 
            m.masterDistrito.ID             as idDistrito,
            m.masterDistrito.description as descripcionDistrito,                                  
            m.masterAfluencia.ID         as idAfluencia,
            m.masterAfluencia.description as descipcionAfluencia,
            m.masterTipoPublico.ID       as idTipoPublico,
            m.masterTipoPublico.description as descripcionTPublico,
            m.masterEstacionTemporada.ID as idEstacionTemporada,
            m.masterEstacionTemporada.masterTemporada.description as descripcionTemporada,
            m.masterEstacionTemporada.masterEstacion.description as decripcionEstacion,
            m.masterNivelCompetencia.ID as idNivelCompetencia,
            m.masterNivelCompetencia.description as descripcionCompetencia,       
            m.registrador,
            m.fechaRegistro,
            m.horaRegistro,
            m.flagFinanciera,
            m.obsFinanciera,
            m.flagCentroEducativo,
            m.obsCentroEducativo,
            m.flagCentroSalud,
            m.obsCentroSalud,
            m.flagIglesia,
            m.obsIglesia,
            m.flagAlquiler,
            m.obsAlquiler,
            m.observacionGeneral,
            m.status,
            e.ID                  as idEstablecimiento,
            e.masterZona.ID as idMasterZona,
            e.masterZona.description as descripcionZona,
            m.masterUsuario.ID as idUsuario,
            m.masterUsuario.nombre as nombreUsuario,
            m.codigoTicket        

        };
        entity EstablecimientoView as
        select from rm.Establecimientos as e
      
        {
           e.direccion as direccion,
           e.horarioApertura as horarioApertura,
           e.horarioCierre as horarioCierre,
           e.razonSocial as razonSocial,
           e.otroRubro as otroRubro,
           e.ID as idEstablecimiento,
           e.masterDistrito.ID as idDistrito,
           e.masterDistrito.description as descripcionDistrito,
           e.masterRubro.ID as idRubro,
           e.masterRubro.description as descripcionRubro,
           e.masterZona.ID as idMasterZona,
           e.masterZona.description as descripcionZona

        };

}