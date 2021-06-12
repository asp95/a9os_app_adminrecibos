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
a9os_app_adminrecibos_admin_empleados.main = (data) => {
	
	if (data.window) a9os_core_window.processWindowData(data);
	self.loadEmpresaSelector();
	self.initSearch();
}

a9os_app_adminrecibos_admin_empleados._closeWindow = () => {

	var parentCCI = core.link.hash.get()["cci"]||false;
	a9os_core_main.windowCrossCallback.execute(parentCCI);
	return true;
}

a9os_app_adminrecibos_admin_empleados.loadEmpresaSelector = () => {
	
	var select = self.component.querySelector(".empresa-selector select");
	a9os_core_main.addEventListener(select, "change", (event, select) => {
		core.sendRequest(
			"/adminrecibos/admin/empleados/getempleados",
			{
				empresa_id : select.value
			},
			{
				fn : (response) => {
					self.loadEmpleadosList(response);
				},
				args : {
					response : false
				}
			}
		);
	});
}

a9os_app_adminrecibos_admin_empleados.loadEmpleadosList = (arrEmpleados) => {
	
	var empleadosList = self.component.querySelector(".empleados-list");
	//empleadosList.querySelector(".empleado:not(.add)").classList.remove("hidden");

	core.preProcess(empleadosList, {empleados : arrEmpleados});
	empleadosList.classList.add("show");
	/*if (arrEmpleados.length == 0){
		empleadosList.querySelectorAll(".empleado:not(.add)").forEach((e, i) => {
			e.classList.add("hidden");
		})
	}*/
	self.attachEmpleadoActions();
}

a9os_app_adminrecibos_admin_empleados.attachEmpleadoActions = (item) => {
	
	if (!item){
		var arrEmpleados = self.component.querySelectorAll(".empleado");
		var arrCloseBtns = self.component.querySelectorAll(".empleado .close");
		var arrEditBtns = self.component.querySelectorAll(".empleado .edit");
	} else {
		var arrEmpleados = item;
		var arrCloseBtns = item.querySelector(".close");
		var arrEditBtns = item.querySelector(".edit");
	}
	a9os_core_main.addEventListener(
		arrEmpleados, 
		"click", 
		(event, item) => {
			if (item.classList.contains("show")) return;
			item.classList.add("show");
			if (item.classList.contains("add")) {
				item.querySelector(".input.nombre input").value = "";
			}
		}
	);

	a9os_core_main.addEventListener(
		arrCloseBtns, 
		"click", 
		(event, btn) => {
			var currEmpleado = btn.goToParentClass("empleado");
			currEmpleado.classList.remove("show");
			self.restoreOriginalEmpleado(currEmpleado);

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

a9os_app_adminrecibos_admin_empleados.restoreOriginalEmpleado = (currEmpleado) => {
	
	currEmpleado.querySelector(".buttons .edit").disabled = true;
	currEmpleado.querySelector(".buttons .close").textContent = "Cerrar";

	var arrInputs = currEmpleado.querySelectorAll(".input input");
	for (var i = 0 ; i < arrInputs.length ; i++) {
		var currInput = arrInputs[i];
		currInput.value = currInput.getAttribute("data-original-info");
	}
}

a9os_app_adminrecibos_admin_empleados.attachInputsActions = (item) => {
	
	if (item) {
		var arrAllInputs = item.querySelectorAll(".input input");
	} else {
		var arrAllInputs = self.component.querySelectorAll(".empleado .input input");
	}

	for (var i = 0 ; i < arrAllInputs.length ; i++){
		var currInput = arrAllInputs[i];
		currInput.setAttribute("data-original-info", currInput.value);
	}

	a9os_core_main.addEventListener(arrAllInputs, "input", (event, item) => {
		var currEmpleado = item.goToParentClass("empleado");
		currEmpleado.querySelector(".buttons .edit").disabled = false;
		currEmpleado.querySelector(".buttons .close").textContent = "Cancelar";
	});
}

a9os_app_adminrecibos_admin_empleados.submitEdit = (event, btn) => {
	
	event.stopPropagation();
	var currEmpleado = btn.goToParentClass("empleado");
	var empleadoId = currEmpleado.getAttribute("data-id");
	var arrData = {
		id : empleadoId,
		empresa_id : self.component.querySelector(".empresa-selector select").value,
		nombre : currEmpleado.querySelector(".input.nombre input").value,
		legajo : currEmpleado.querySelector(".input.legajo input").value,
		cuil : currEmpleado.querySelector(".input.cuil input").value,
		fecha_ingreso : currEmpleado.querySelector(".input.fecha_ingreso input").value,
		remuneracion_basica : currEmpleado.querySelector(".input.remuneracion_basica input").value,
		categoria : currEmpleado.querySelector(".input.categoria input").value,
	}

	if (currEmpleado.classList.contains("add")) { //is new

		var newItem = currEmpleado.cloneNode(true);
		newItem.classList.remove("add");
		newItem.classList.add("inserting");
		currEmpleado.parentElement.appendChild(newItem);

		currEmpleado.classList.remove("show");
		currEmpleado.querySelector(".input.nombre input").value = "";
		currEmpleado.querySelector(".input.legajo input").value = "";
		currEmpleado.querySelector(".input.cuil input").value = "";
		currEmpleado.querySelector(".input.fecha_ingreso input").value = "";
		currEmpleado.querySelector(".input.remuneracion_basica input").value = "";
		currEmpleado.querySelector(".input.categoria input").value = "";

		self.attachEmpleadoActions(newItem);
	} else {
		currEmpleado.classList.add("inserting");
	}

	core.sendRequest(
		"/adminrecibos/admin/empleados/save",
		arrData,
		{
			fn : (response) => {
				var newItem = self.component.querySelector(".empleado.inserting");
				if (newItem){
					newItem.classList.remove("inserting");
					newItem.setAttribute("data-id", response.id);
					var arrInputNames = ["nombre", "legajo", "cuil", "fecha_ingreso", "remuneracion_basica", "categoria"];

					for (var i = 0 ; i < arrInputNames.length ; i++) {
						var currInputName = arrInputNames[i];
						if (currInputName == "nombre") {
							newItem.querySelector(".title").textContent = response[currInputName];
						}
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

a9os_app_adminrecibos_admin_empleados.initSearch = () => {
	
	var searchInput = self.component.querySelector("input.search");
	var searchTimeout = false;

	a9os_core_main.addEventListener(searchInput, "keyup", (event, searchInput) => {
		if (searchTimeout) clearTimeout(searchTimeout);
		searchTimeout = setTimeout((event, searchInput) => {
			searchInput.value = searchInput.value.trim();
			var arrEmpleados = searchInput.parentElement.querySelectorAll(".empleados-list .empleado:not(.add)");

			if (searchInput.value == "") {
				for (var i = 0 ; i < arrEmpleados.length ; i++){
					arrEmpleados[i].classList.remove("filtered");
				}
				self.component.querySelector(".search-not-found").classList.remove("show");
			} else {
				var qtyFiltered = 0;
				for (var i = 0 ; i < arrEmpleados.length ; i++){
					var currEmpleado = arrEmpleados[i];
					var currEmpleadoText = getEmpleadoAllText(currEmpleado);
					if (currEmpleadoText.toLowerCase().indexOf(searchInput.value) == -1) {
						currEmpleado.classList.add("filtered");
						qtyFiltered++;
					} else {
						currEmpleado.classList.remove("filtered");
						qtyFiltered--;
					}
				}

				
				if (qtyFiltered == arrEmpleados.length) {
					self.component.querySelector(".search-not-found").classList.add("show");
				} else {
					self.component.querySelector(".search-not-found").classList.remove("show");
				}
			}
		}, 500, event, searchInput);
	});

	function getEmpleadoAllText(empleado) {
		var arrFieldNames = ["nombre", "legajo", "cuil", "fecha_ingreso", "remuneracion_basica", "categoria"];
		var outputStr = "";

		for (var i = 0 ; i < arrFieldNames.length ; i++ ){
			outputStr += empleado.querySelector(".input."+arrFieldNames[i]+" input").value;
		} 

		return outputStr;
	}
}