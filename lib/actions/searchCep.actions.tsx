"use server";

async function CepSearc({ cep:cepData }: { cep: string }) {
  try {
    const cep = cepData.replace(/\-|\s/g, "");
    const data = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    console.log(data)
    const json = await data.json();
    return json;
  } catch(erro) {
    console.log(erro)
    return null;
  }
}

export default CepSearc;
