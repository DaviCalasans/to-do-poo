class Formulario{
    constructor(){
        this.formulario = document.querySelector('.formulario');
        this.eventos();
    }

    eventos(){
        this.formulario.addEventListener('submit', (e) => {
            this.handleSubmit(e);
        })
    }

    handleSubmit(e){
        e.preventDefault();
        this.removeErros();
        const isValidForm = this.validarCampos();
        if(isValidForm){
            this.formulario.submit();
        }
    }

    removeErros(){
        const erros = document.querySelectorAll('.error')

        for (let erro of erros){
            erro.remove();
        }
    }

    validarCampos(){
        let valid = true;

        const campos = document.querySelectorAll('.validar');
        for(let campo of campos){
            if(!campo.value.trim()){
                this.createError(campo, "O campo não pode estar vazio!");
                valid = false;
            } 
            else if(campo.classList.contains('nameTask')) valid = this.validarName(campo) && valid;
            else if(campo.classList.contains('dateTask')) valid = this.validarData(campo) && valid;
            else if(campo.classList.contains('statusTask')) valid = this.validarStatus(campo) && valid;
            //$$ valid garante que assim que qualquer campo falha, o valid nunca mais volta a ser true
        }

        return valid;
    }

    validarName(campo){
        const nomeFormatado = campo.value.replace(/\s+/g, " ");

        if(String(nomeFormatado).length < 3 || String(nomeFormatado).length > 50){
            this.createError(campo, 'O nome da atividade deve ter entre 3 e 50 caracteres')
            return false;
        }

        return true
    }

    validarData(campo){
        const dateTask = campo.value;
        
        let hoje =  new Date().toISOString().split("T")[0];
        const dataLimite = new Date();
        dataLimite.setFullYear(new Date().getFullYear() + 2);
        const dateLimiteFormat = dataLimite.toISOString().split("T")[0];
        console.log(dateLimiteFormat, dateTask)

        if(dateTask < hoje){
            this.createError(campo, 'A data informada não deve estar no passado!')
            return false;
        }

        if(dateTask > dateLimiteFormat) {
            this.createError(campo, 'A data não pode ultrapassar 2 anos!')
            return false;
        }

        return true;
    }

    validarStatus(campo){
        const allowValues = ['pendente', 'em progresso','concluida'];
        const test = allowValues.includes(campo.value);
        
        if(!test){
            this.createError(campo, `O valor enviado é inválido! (Valor enviado: ${campo.value})`)
            return false;
        }

        return true;
    }

    createError(campo,msg){
        const grupo = campo.closest(".form-group");
        const p = document.createElement('p');
        p.className = 'error';
        p.textContent = msg;
        grupo.appendChild(p);
    }
}

new Formulario;