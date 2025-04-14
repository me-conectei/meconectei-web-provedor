export function formatAxiosErrorMessage(erro) {
    const mensagensErro = [];

    if (erro.response && erro.response.data && erro.response.data.camps) {
        const dados = erro.response.data;

        for (const campo in dados.camps) {
            if (dados.camps[campo] && dados.camps[campo].message) {
                mensagensErro.push(dados.camps[campo].message);
            }
        }
    }

    return mensagensErro.length > 0 ? mensagensErro : ["Ocorreu um erro inesperado. Tente novamente mais tarde."];
}