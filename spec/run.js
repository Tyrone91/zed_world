import Jasmine from 'jasmine'


const jas = new Jasmine({});
jas.loadConfigFile("spec/support/jasmine.json");
jas.execute();