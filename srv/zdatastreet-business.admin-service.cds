using {nebula.com as rm} from '../db/schema';

@path : 'service/zadmin'
service ZadminService {
    entity MasterTipoPublicos         as projection on rm.MasterTipoPublicos;
    entity MasterDistritos            as projection on rm.MasterDistritos;
    entity MasterAfluencias           as projection on rm.MasterAfluencias;
    entity MasterRubros               as projection on rm.MasterRubros;
    entity MasterEstaciones           as projection on rm.MasterEstaciones;
    entity MasterZonas            as projection on rm.MasterZonas;
    entity MasterNivelCompetencias           as projection on rm.MasterNivelCompetencias;

    entity MasterEstacionesTemporadas as projection on rm.MasterEstacionesTemporadas {
        ID,
        masterEstacion.ID           as idEstacion,
        masterEstacion.description  as descripcionEstacion,
        masterTemporada.ID          as idTemporada,
        masterTemporada.description as descripcionTemporada
    };

     entity MasterData as select from rm.MasterTipoPublicos as m {
		m.ID,
        m.description,		
        null as groupMaster:String(20)
	};
}
