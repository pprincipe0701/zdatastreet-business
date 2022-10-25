namespace nebula.com;
using { Currency, managed, cuid } from '@sap/cds/common';

entity MasterTipoPublicos : managed {
  key ID : Integer;
  description   : String(50); 
  status   : String(2);  
};



entity MasterDistritos : managed {
  key ID : Integer;
  description   : String(50);  
  status   : String(2); 
  masterZonas    : Composition of many MasterZonas on masterZonas.masterDistrito = $self;
};

entity MasterZonas : managed {
  key ID : Integer;
  description   : String(50);  
  masterDistrito:Association to MasterDistritos;
  status   : String(2); 

};


entity MasterNivelCompetencias : managed {
  key ID : Integer;
  description   : String(50); 
  status   : String(2);  
};

entity MasterAfluencias : managed {
  key ID : Integer;
  description   : String(50);
  status   : String(2);   
};

entity MasterRubros : managed {
  key ID : Integer;
  description   : String(50);
  status   : String(2);   
};

entity MasterEstaciones : managed {
  key ID : Integer;
  description   : String(50);  
  status   : String(2); 
};
entity MasterTemporadas : managed {
  key ID : Integer;
  description   : String(50);  
  status   : String(2); 
};
entity MasterEstacionesTemporadas : managed {
  key ID : Integer;
  masterEstacion : Association to MasterEstaciones;
  masterTemporada : Association to MasterTemporadas;
};

@assert.unique: {
  Estblecimiento_uk: [ masterDistrito,masterZona, razonSocial, direccion ]
  
}
entity Establecimientos : managed {
  key ID : UUID;  
  razonSocial: String(250);
  direccion: String(500);
  horarioApertura: String(5);
  horarioCierre: String(5);
  otroRubro: String(255);
  coordenada: String(255);
  masterRubro:Association to MasterRubros;
  masterDistrito:Association to MasterDistritos;
  masterZona:Association to MasterZonas;
  movimientos  : Association to many MovimientosDiarios on movimientos.establecimiento = $self;
};

@assert.unique: {
  MovimientoDiario_uk: [ establecimiento, masterAfluencia, masterTipoPublico, masterEstacionTemporada,registrador,
  fechaRegistro, horaRegistro ]
  
}
entity MovimientosDiarios : managed {
  key ID : UUID;  
  razonSocial: String(250);
  direccion: String(500);
  horarioApertura: String(5);
  horarioCierre: String(5);
  otroRubro: String(255);
  coordenada: String(255);
  masterRubro:Association to MasterRubros;
  masterDistrito:Association to MasterDistritos;  
  establecimiento:Association to Establecimientos; 
  masterAfluencia:Association to MasterAfluencias;
  masterNivelCompetencia:Association to MasterNivelCompetencias;
  masterTipoPublico:Association to MasterTipoPublicos;
  masterEstacionTemporada:Association to MasterEstacionesTemporadas;   
  registrador: String(100);
  fechaRegistro: Date;
  horaRegistro: String(5);
  flagFinanciera: String(1);
  obsFinanciera: String(1000);
  flagCentroEducativo: String(1);
  obsCentroEducativo: String(1000);
  flagCentroSalud: String(1);
  obsCentroSalud: String(1000);
  flagIglesia: String(1);
  obsIglesia: String(1000);
   flagAlquiler: String(1);
  obsAlquiler: String(1000);
  observacionGeneral: String(1000);
  status: String(2);
};