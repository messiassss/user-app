class UserController {
    constructor(formId, tableId) {
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
    }


    onSubmit() {

        this.formEl.addEventListener("submit", event => {

            event.preventDefault();

            let values = this.getValues();


            this.getPhoto(content=>{
                values.photo = content;

                this.addLine(values);
            })
            
        })

    }

    //intead of using callback, I could use the async/await methods, it is simpler, less complex and easy to implement
    getPhoto(callback){

        let fileReader = new FileReader();

        let elements = [...this.formEl.elements].filter((item)=>{
            if(item.name === "photo"){
                return item;
            }
        })


        let file = elements[0].files[0];

        //onload is called after the readAsDataURL
        fileReader.onload = ()=>{
            callback(fileReader.result);
        }

        //I am calling a callback, because i cannot return until the file have been fully read

        fileReader.readAsDataURL(file);


    }

    getValues() {

        let user = {};

        //spread
        [...this.formEl.elements].forEach(function (field, index) {

            if (field.name == "gender") {
                if (field.checked) user[field.name] = field.value;
            } else {
                user[field.name] = field.value;
            }
        });

        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        )
    }


    addLine(dataUser, tableId) {


        this.tableEl.innerHTML =
            `<tr>
                <td><img src=${dataUser.photo} alt="User Image" class="img-circle img-sm"></td>
                <td> ${dataUser.name}   </td>
                <td> ${dataUser.email} </td>
                <td>${dataUser.admin} </td>
                <td>${dataUser.birth} </td>
                <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            </tr>`
        }
    }