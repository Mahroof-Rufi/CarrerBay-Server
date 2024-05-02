import employer from "../../domain/employer";

interface employerInterface {

    insertOne(employer:employer): Promise<employer>,
    findByEmail(email:string): Promise<employer | null>,

}

export default employerInterface