import employer from "../../domain/employer";

interface employerRepo {

    insertOne(employer:employer): Promise<employer>,
    findByEmail(email:string): Promise<employer | null>,

}

export default employerRepo