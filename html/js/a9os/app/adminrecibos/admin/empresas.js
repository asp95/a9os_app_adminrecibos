/*_gtlsc_
 * os.com.ar (a9os) - Open web LAMP framework and desktop environment
 * Copyright (C) 2019-2021  Santiago Pereyra (asp95)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.*/
a9os_app_adminrecibos_admin_empresas.main = (data) => {
	
	if (data.window) a9os_core_window.processWindowData(data);
	self.initSearch();
	self.attachEmpresaActions();
}

a9os_app_adminrecibos_admin_empresas._closeWindow = () => {
	
	var parentCCI = core.link.hash.get()["cci"]||false;
	a9os_core_main.windowCrossCallback.execute(parentCCI);
	return true;
}

a9os_app_adminrecibos_admin_empresas.initSearch = () => {
	
	var searchInput = self.component.querySelector("input.search");
	var searchTimeout = false;

	a9os_core_main.addEventListener(searchInput, "keyup", (event, searchInput) => {
		if (searchTimeout) clearTimeout(searchTimeout);
		searchTimeout = setTimeout((event, searchInput) => {
			searchInput.value = searchInput.value.trim();
			var arrEmpresas = searchInput.parentElement.querySelectorAll(".empresas-list .empresa:not(.add)");

			if (searchInput.value == "") {
				for (var i = 0 ; i < arrEmpresas.length ; i++){
					arrEmpresas[i].classList.remove("filtered");
				}
				self.component.querySelector(".search-not-found").classList.remove("show");
			} else {
				var qtyFiltered = 0;
				for (var i = 0 ; i < arrEmpresas.length ; i++){
					var currEmpresa = arrEmpresas[i];
					if (currEmpresa.textContent.toLowerCase().indexOf(searchInput.value) == -1) {
						currEmpresa.classList.add("filtered");
						qtyFiltered++;
					} else {
						currEmpresa.classList.remove("filtered");
						qtyFiltered--;
					}
				}

				if (qtyFiltered == arrEmpresas.length) {
					self.component.querySelector(".search-not-found").classList.add("show");
				} else {
					self.component.querySelector(".search-not-found").classList.remove("show");
				}
			}
		}, 400, event, searchInput);
	});
}

a9os_app_adminrecibos_admin_empresas.attachEmpresaActions = (item) => {
	
	if (!item){
		var arrEmpresas = self.component.querySelectorAll(".empresa");
		var arrCloseBtns = self.component.querySelectorAll(".empresa .close");
		var arrEditBtns = self.component.querySelectorAll(".empresa .edit");
	} else {
		var arrEmpresas = item;
		var arrCloseBtns = item.querySelector(".close");
		var arrEditBtns = item.querySelector(".edit");
	}
	a9os_core_main.addEventListener(
		arrEmpresas, 
		"click", 
		(event, item) => {
			if (item.classList.contains("show")) return;
			item.classList.add("show");
		}
	);

	a9os_core_main.addEventListener(
		arrCloseBtns, 
		"click", 
		(event, btn) => {
			var currEmpresa = btn.goToParentClass("empresa");
			currEmpresa.classList.remove("show");
			self.restoreOriginalEmpresa(currEmpresa);

			event.stopPropagation();
		}
	);

	a9os_core_main.addEventListener(
		arrEditBtns, 
		"click", 
		self.submitEdit
	);

	self.attachInputsActions(item);
}

a9os_app_adminrecibos_admin_empresas.attachInputsActions = (item) => {
	
	if (item) {
		var arrAllInputs = item.querySelectorAll(".input input");
	} else {
		var arrAllInputs = self.component.querySelectorAll(".empresa .input input");
	}
	for (var i = 0 ; i < arrAllInputs.length ; i++){
		var currInput = arrAllInputs[i];
		currInput.setAttribute("data-original-info", currInput.value);
	}

	a9os_core_main.addEventListener(arrAllInputs, "input", (event, item) => {
		var currEmpresa = item.goToParentClass("empresa");
		currEmpresa.querySelector(".buttons .edit").disabled = false;
		currEmpresa.querySelector(".buttons .close").textContent = "Cancelar";
	});
}

a9os_app_adminrecibos_admin_empresas.restoreOriginalEmpresa = (currEmpresa) => {
	
	currEmpresa.querySelector(".buttons .edit").disabled = true;
	currEmpresa.querySelector(".buttons .close").textContent = "Cerrar";

	var arrInputs = currEmpresa.querySelectorAll(".input input");
	for (var i = 0 ; i < arrInputs.length ; i++) {
		var currInput = arrInputs[i];
		currInput.textContent = currInput.getAttribute("data-original-info");
	}
}

a9os_app_adminrecibos_admin_empresas.submitEdit = (event, btn) => {
	
	event.stopPropagation();
	var currEmpresa = btn.goToParentClass("empresa");
	var empresaId = currEmpresa.getAttribute("data-id");
	var arrData = {
		id : empresaId,
		nombre : currEmpresa.querySelector(".input.nombre input").value,
		descripcion : currEmpresa.querySelector(".input.descripcion input").value,
		cuit : currEmpresa.querySelector(".input.cuit input").value,
	}

	if (currEmpresa.classList.contains("add")) { //is new

		var newItem = currEmpresa.cloneNode(true);
		newItem.classList.remove("add");
		newItem.classList.add("inserting");
		currEmpresa.parentElement.appendChild(newItem);

		currEmpresa.classList.remove("show");
		currEmpresa.querySelector(".title").textContent = "Agregar empresa";
		currEmpresa.querySelector(".input.nombre input").value = "";
		currEmpresa.querySelector(".input.descripcion input").value = "";
		currEmpresa.querySelector(".input.cuit input").value = "";

		self.attachEmpresaActions(newItem);
	} else {
		currEmpresa.classList.add("inserting");
	}

	core.sendRequest(
		"/adminrecibos/admin/empresas/save",
		arrData,
		{
			fn : (response) => {
				var newItem = self.component.querySelector(".empresa.inserting");
				if (newItem){				
					newItem.classList.remove("inserting");
					newItem.setAttribute("data-id", response.id);
					var arrInputNames = ["nombre", "descripcion", "cuit"];

					for (var i = 0 ; i < arrInputNames.length ; i++) {
						var currInputName = arrInputNames[i];
						if (currInputName == "nombre") newItem.querySelector(".title").textContent = response[currInputName];	
						newItem.querySelector(".input."+currInputName+" input").value = response[currInputName];
						newItem.querySelector(".input."+currInputName+" input").setAttribute("data-original-info", response[currInputName]);
					}

					newItem.querySelector(".btn.edit").disabled = true;
					newItem.querySelector(".btn.close").textContent = "Cerrar";
				} 
			},
			args : {
				response : false
			}
		}
	);
}