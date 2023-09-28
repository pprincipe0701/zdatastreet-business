const cds = require('@sap/cds')
const { MasterTipoPublicos, MasterDistritos, MasterAfluencias, MasterRubros, MasterEstaciones, MasterNivelCompetencias } = cds.entities;

/** Service implementation for CatalogService */
module.exports = cds.service.impl(srv => {
    srv.after('READ', 'MasterData', _updateContentList);

});

/** Add some discount for overstocked books */
async function _updateContentList(data) {
    console.debug('_updateContentList_1 :: ', data);
    let listMaster = Array.isArray(data) ? data : [data];
    
    //const tx = cds.transaction(req);
    //const listMasterLevel = await tx.run(SELECT.from(MasterLevels));kkk
    const listMasterTipoPublicos = await SELECT.from(MasterTipoPublicos).where({ status: '1' });    
    const listMasterDistritos = await SELECT.from(MasterDistritos).where({ status: '1' });  
    const listMasterAfluencias = await SELECT.from(MasterAfluencias).where({ status: '1' });  
    const listMasterRubros = await SELECT.from(MasterRubros).where({ status: '1' });      
    const listMasterEstaciones = await SELECT.from(MasterEstaciones).where({ status: '1' });  
    const listMasterNivelCompetencias = await SELECT.from(MasterNivelCompetencias).where({ status: '1' });  
    
    data.forEach((ele) => {
        ele.groupMaster = 'MasterTipoPublicos';
    });

    listMasterDistritos.forEach((ele) => {
        let objAux = { ID: ele.ID, description: ele.description, groupMaster: 'MasterDistritos' };
        listMaster.push(objAux);
    });

    listMasterAfluencias.forEach((ele) => {
        let objAux = { ID: ele.ID, description: ele.description, groupMaster: 'MasterAfluencias' };
        listMaster.push(objAux);
    });

    listMasterRubros.forEach((ele) => {
        let objAux = { ID: ele.ID, description: ele.description, groupMaster: 'MasterRubros' };
        listMaster.push(objAux);
    });

    listMasterEstaciones.forEach((ele) => {
        let objAux = { ID: ele.ID, description: ele.description, groupMaster: 'MasterEstaciones' };
        listMaster.push(objAux);
    });

    listMasterNivelCompetencias.forEach((ele) => {
        let objAux = { ID: ele.ID, description: ele.description, groupMaster: 'MasterNivelCompetencias' };
        listMaster.push(objAux);
    });


    console.info('_updateContentList_dos :: ', data);
}