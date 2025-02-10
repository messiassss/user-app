class UserController {
    constructor(formCreateId,formUpdateId ,tableId) {
        this.formEl = document.getElementById(formCreateId);
        this.formUpdateEl = document.getElementById(formUpdateId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
    }

    onEdit() {
        document.querySelector("#box-user-update .btn-cancel").addEventListener('click', e => {
            this.showPanelCreate();
        })

        this.formUpdateEl.addEventListener("submit",e=>{


            event.preventDefault();
            let btn = this.formUpdateEl.querySelector("[type=submit]")
            btn.disabled = true;
            debugger;
            let values = this.getValues(this.formUpdateEl);
            let index = this.formUpdateEl.dataset.trIndex;
            let tr = this.tableEl.rows[index];

            this.getPhoto(this.formUpdateEl).then(
                (content) => {
                    values.photo = content;
                    tr.dataset.user = JSON.stringify(values);
                    tr.innerHTML = `<tr>
                                        <td><img src=${values.photo} alt="User Image" class="img-circle img-sm"></td>
                                        <td> ${values.name}   </td>
                                        <td> ${values.email} </td>
                                        <td>${(values.admin) ? 'Sim' : 'Não'} </td>
                                        <td>${Utils.dateFormater(values.register)} </td>
                                        <td>
                                        <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                                        <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                                        </td>
                                    </tr>`
                    btn.disabled = false;
                    this.addEventsTr(tr);
                    this.updateCount();
                },
                (e) => {
                    console.error(e)
                }

            )


            
        
            
        })
    }

    addEventsTr(tr){
        tr.querySelector(".btn-edit").addEventListener("click", e => {
            //for in, almost like 'enhanced for' from java
           
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;
            let json = JSON.parse(tr.dataset.user);

            for (let name in json) {
                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");
                if (field) {
                    if(field.type == "file") continue;
                    
                    switch(field.type){
                        case 'file' : 
                             this.formUpdateEl.querySelector(".photo").src = json[name];
                        break;
                        case 'radio' : 
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value="+json[name]+"]");
                            field.checked = true;
                        break;
                        case 'checkbox':
                            field.checked = json[name]
                        break;
                        default:
                            field.value = json[name];
                    }
                    
                }
            }
            

            this.showPanelUpdate();
        })
    }
    onSubmit() {

        this.formEl.addEventListener("submit", event => {

            event.preventDefault();

            let values = this.getValues(this.formEl);

            let btn = this.formEl.querySelector("[type=submit]")
            if (!values) return false

            btn.disabled = true;
            this.getPhoto(this.formEl).then(
                (content) => {
                    values.photo = content;

                    this.addLine(values);
                    this.formEl.reset();
                    btn.disabled = false;
                },
                (e) => {
                    console.error(e)
                }

            )

        })

    }


    getPhoto(form) {

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...form.elements].filter((item) => {
                if (item.name === "photo") {
                    return item;
                }
            })

            let file = elements[0].files[0];


            fileReader.onload = () => {
                resolve(fileReader.result);
            }

            fileReader.onerror = (e) => {
                reject(e)
            }

            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/boxed-bg.jpg');
            }
        })

    }

    getValues(formEl) {
        
        let user = {};
        let isValid = true;
        //spread
        [...formEl.elements].forEach(function (field, index) {

            if ((['name', 'email', 'password']).indexOf(field.name) > -1 && !field.value) {

                field.parentElement.classList.add("has-error")
                isValid = false;
            }

            if (field.name == "gender") {
                if (field.checked) user[field.name] = field.value;
            } else if (field.name == "admin") {
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;
            }
        });

        if (!isValid) {
            return false;
        }

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

        let tr = document.createElement("tr");

        tr.dataset.user = JSON.stringify(dataUser);
        tr.innerHTML =
            `<tr>
                <td><img src=${dataUser.photo} alt="User Image" class="img-circle img-sm"></td>
                <td> ${dataUser.name}   </td>
                <td> ${dataUser.email} </td>
                <td>${(dataUser.admin) ? 'Sim' : 'Não'} </td>
                <td>${Utils.dateFormater(dataUser.register)} </td>
                <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            </tr>`

            this.addEventsTr(tr);


        this.tableEl.appendChild(tr);

        this.updateCount();

    }


    showPanelCreate() {
        document.getElementById("box-user-create").style.display = "block";
        document.getElementById("box-user-update").style.display = "none";
    }
    showPanelUpdate() {
        document.getElementById("box-user-create").style.display = "none";
        document.getElementById("box-user-update").style.display = "block";
    }
    updateCount() {

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr => {
            numberUsers++;
            let user = JSON.parse(tr.dataset.user);
            if (user._admin) numberAdmin++;

        })


        document.getElementById("number-users").innerHTML = numberUsers;
        document.getElementById("number-users-admin").innerHTML = numberAdmin;


    }


}