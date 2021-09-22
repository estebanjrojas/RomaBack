const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");

chai.should();
chai.use(chaiHttp);

describe("Public Tests...", ()=> {
    describe("GET Ciudades.selectAllCiudades",  ()=>{
        it("Una entrada incorrecta debe devolver el estado 404", (done)=>{
            
            chai.request(server)
            .get("./selectAllCiudades")
            .then((err, response) => {
                if (err) done(err);
                response.should.have.status(404);
                done();
            })
            .catch(err => {
                done();
                throw err;
            });
        });

      /*  it("Deberia devolver un array", async (done)=>{
            await chai.request(server)
            .get("./selectAllCiudades")
            .end((err, response) => {
                if (err) done(err);
                response.body.should.be.a["array"];
            done();
            });
        });*/
    })
})