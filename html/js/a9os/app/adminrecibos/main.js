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
a9os_app_adminrecibos_main.main = (data) => {
	if (data.window) a9os_core_window.processWindowData(data, [
		{
			shortcut : ["ctrl", "shift", "F"],
			action : {
				fn : self.project.new,
				args : { }
			}
		},
		{
			shortcut : ["ctrl", "S"],
			action : {
				fn : self.project.save,
				args : { }
			}
		},
		{
			shortcut : ["ctrl", "shift", "S"],
			action : {
				fn : self.project.saveAs,
				args : { }
			}
		},
		{
			shortcut : ["ctrl", "O"],
			action : {
				fn : self.project.open,
				args: { }
			}
		}
	]);


	self.attachMenubar();

	self.initGui();

	self.component.fileExtensions = data.fileExtensions;

	self.project.handle();
	self.pdf.handle();
}

a9os_app_adminrecibos_main.attachMenubar = () => {
	a9os_core_window.setMenuBar({
		Archivo : [
			{
				name : "Nuevo proyecto",
				action : "project.new",
				shortcut : ["Ctrl", "Shift", "F"]
			},
			{
				name : "Abrir proyecto",
				action : "project.open",
				shortcut : ["Ctrl", "O"]
			},
			"separator",
			{
				name : "Guardar proyecto",
				action : "project.save",
				shortcut : ["Ctrl", "S"],
				active : false,
			},
			{
				name : "Guardar proyecto como",
				action : "project.saveAs",
				shortcut : ["Ctrl", "Shift", "S"],
				active : false,
			},
			"separator",
			{
				name : "Exportar PDF",
				active : false,
				action : "pdf.export"
			},
			"separator",
			{
				name : "Salir",
				action : "close",
				shortcut : ["Shift", "F4"]
			}
		],
		Editar : [
			{
				name : "Administrar empresas",
				action : "configWindows.openEmpresas"
			},
			{
				name : "Administrar empleados",
				action : "configWindows.openEmpleados",
			},
		]
	});
}

a9os_app_adminrecibos_main.close = () => {
	a9os_core_window.close();
}

a9os_app_adminrecibos_main._closeWindow = () => {
	
	return a9os_app_vf_main.fileHandle.close(self.component, self.component.projectFileHandleId, {
		fn : (component) => {
			a9os_core_main.removeWindow(component);
		},
		args : {
			component : self.component
		}
	});
}

a9os_app_adminrecibos_main.initGui = () => {
	self.toolbar.init();
	self.pages.init();

	self.empresa.init();
	self.empleado.init();
	self.conceptos.init();
	//read file
}








a9os_app_adminrecibos_main.toolbar = {};
a9os_app_adminrecibos_main.toolbar.init = () => {
	var toolbar = self.component.querySelector(".toolbar");

	var newFileBtn = toolbar.querySelector(".btn.new-file");
	var openFileBtn = toolbar.querySelector(".btn.open-file");
	var saveFileBtn = toolbar.querySelector(".btn.save-file");
	var exportPdfBtn = toolbar.querySelector(".btn.export-pdf");

	a9os_core_main.addEventListener(newFileBtn, "click", self.project.new);
	a9os_core_main.addEventListener(openFileBtn, "click", self.project.open);
	a9os_core_main.addEventListener(saveFileBtn, "click", self.project.save);
	a9os_core_main.addEventListener(exportPdfBtn, "click", self.pdf.export);
}








a9os_app_adminrecibos_main.pages = {};
a9os_app_adminrecibos_main.pages.init = () => {
	
	self.component.arrPages = [];
	self.component.currPageNumber = 1;

	var nextBtn = self.component.querySelector(".toolbar .pages-section .buttons .next");
	var backBtn = self.component.querySelector(".toolbar .pages-section .buttons .prev");
	var borrarBtn = self.component.querySelector(".toolbar .pages-section .buttons .delete");

	nextBtn.disabled = true;
	backBtn.disabled = true;
	borrarBtn.disabled = true;
	nextBtn.classList.add("new-page");


	a9os_core_main.addEventListener(nextBtn, "click", (event, nextBtn) => {
		if (self.component.currPageNumber < self.component.arrPages.length) {
			nextBtn.classList.remove("new-page");
			self.pages.next();

			if (self.component.currPageNumber == self.component.arrPages.length) {
				nextBtn.classList.add("new-page");
			}

		} else if (self.component.currPageNumber == self.component.arrPages.length) {
			nextBtn.classList.add("new-page");
			self.pages.new();
			if (!self.pages.canSave()){
				 nextBtn.disabled = true;	
				 borrarBtn.disabled = true;	
			}

		}


		if (self.component.currPageNumber <= 1) {
			backBtn.disabled = true;
		} else {
			backBtn.disabled = false;
		}
	});

	a9os_core_main.addEventListener(backBtn, "click", (event, backBtn) => {
		self.pages.prev();
		if (self.component.currPageNumber <= 1) {
			backBtn.disabled = true;
		} else {
			backBtn.disabled = false;
		}

		if (self.component.currPageNumber != self.component.arrPages.length) {
			nextBtn.classList.remove("new-page");
		}
	});

	a9os_core_main.addEventListener(borrarBtn, "click", (event, borrarBtn) => {
		self.pages.delete();

		if (self.component.currPageNumber <= 1) {
			backBtn.disabled = true;
		} else {
			backBtn.disabled = false;
		}
	});
}

a9os_app_adminrecibos_main.pages.save = () => {

	if (!self.pages.canSave()) return;

	self.project.setIsProjectModified();
	
	if (!self.component.arrPages[self.component.currPageNumber]) {
		self.component.arrPages[self.component.currPageNumber-1] = {};
	}

	self.component.arrPages[self.component.currPageNumber-1] = {
		empresa_id : self.component.querySelector(".empresa-selector").value,
		empleado : JSON.parse(self.component.querySelector(".section.empleado .empleado-selected").getAttribute("data-alldata")),
		banco : self.banco.get(),
		conceptos : self.component.arrConceptos.slice(),
		total : self.component.arrTotales
	};

	self.pages.refreshPageIndicator();
	
	self.project.enableSave();
}

a9os_app_adminrecibos_main.pages.canSave = () => {
	if (!self.component.querySelector(".empresa-selector").value) return false;
	if (!self.component.querySelector(".section.empleado .empleado-selected").classList.contains("show")) return false;

	return true;
}

a9os_app_adminrecibos_main.pages.new = () => {
	self.pages.save();

	self.component.currPageNumber++;


	self.component.querySelector(".section.empleado .empleado-selected").classList.remove("show");
	core.preProcess(self.component.querySelector(".section.empleado .empleado-selected"), { empleado : {
		allData : "{}",
		legajo : "",
		nombre : "",
		cuil : "",
		fecha_ingreso : "",
		antiguedad : "",
		remuneracion_basica : "",
		categoria : ""
	} });
	self.conceptos.recalculate();

	self.component.arrPages[self.component.currPageNumber-1] = {
		empresa_id : self.component.querySelector(".empresa-selector").value,
		empleado : JSON.parse(self.component.querySelector(".section.empleado .empleado-selected").getAttribute("data-alldata")),
		banco : self.banco.get(),
		conceptos : self.component.arrConceptos.slice(),
		total : self.component.arrTotales
	};

	self.pages.refreshPageIndicator();
}

a9os_app_adminrecibos_main.pages.next = () => {
	self.pages.save();
	self.component.currPageNumber++;

	self.pages.loadPage(self.component.currPageNumber);
	self.pages.refreshPageIndicator();
}

a9os_app_adminrecibos_main.pages.prev = () => {
	self.pages.save();
	self.component.currPageNumber--;
	
	self.pages.loadPage(self.component.currPageNumber);
	self.pages.refreshPageIndicator();
}

a9os_app_adminrecibos_main.pages.delete = () => {
	self.pages.save();

	if (self.component.arrPages.length == 1) {
		var borrarBtn = self.component.querySelector(".toolbar .pages-section .buttons .delete");
		borrarBtn.disabled = true;
	} else {
		var pageIndex = self.component.currPageNumber-1;
		self.component.arrPages.splice(pageIndex, 1);
		if (pageIndex+1 >= self.component.arrPages.length) {
			self.pages.loadPage(pageIndex);
		} else {
			self.pages.loadPage(pageIndex+1);
		}
		self.pages.refreshPageIndicator();
	}
	
}

a9os_app_adminrecibos_main.pages.loadPage = (pageNum) => {
	var nextBtn = self.component.querySelector(".toolbar .pages-section .buttons .next");
	var backBtn = self.component.querySelector(".toolbar .pages-section .buttons .prev");
	var borrarBtn = self.component.querySelector(".toolbar .pages-section .buttons .delete");

	if (self.component.currPageNumber < 1) self.component.currPageNumber = 1;

	if (self.component.currPageNumber > self.component.arrPages.length) 
		self.component.currPageNumber = self.component.arrPages.length;
	
	var pageIndex = pageNum-1;

	if (pageIndex == 0) backBtn.disabled = true;
	if (pageIndex < self.component.arrPages.length-1) nextBtn.classList.remove("new-page");
	if (pageIndex == self.component.arrPages.length-1) nextBtn.classList.add("new-page");

	var pageToLoad = self.component.arrPages[pageIndex];
	self.component.querySelector(".empresa-selector").value = pageToLoad.empresa_id;


	self.empleado.show(pageToLoad.empleado);
	self.banco.set(pageToLoad.banco);

	self.component.arrConceptos = pageToLoad.conceptos;
	self.component.arrTotales = pageToLoad.total;
	self.conceptos.recalculate();

	if (nextBtn.classList.contains("new-page") && !self.pages.canSave()) {
		nextBtn.disabled = true;
		borrarBtn.disabled = true;
	} else {
		nextBtn.disabled = false;	
		borrarBtn.disabled = false;	
	}
}

a9os_app_adminrecibos_main.pages.refreshPageIndicator = () => {
	self.component.querySelector(".toolbar .pages-section .paginas .qty .curr-page").textContent = self.component.currPageNumber;
	self.component.querySelector(".toolbar .pages-section .paginas .qty .total-pages").textContent = self.component.arrPages.length;
}










a9os_app_adminrecibos_main.empresa = {};
a9os_app_adminrecibos_main.empresa.init = () => {
	
	var empresaSelector = self.component.querySelector(".empresa-selector");
	a9os_core_main.addEventListener(empresaSelector, "change", (event, empresaSelector) => {
		if (empresaSelector.value == "0") {
			self.empleado.disableInput();
			self.empleado.search.clear();

			var addNewButton = self.component.querySelector(".section.conceptos .btn.add-new");
			addNewButton.disabled = true;

			self.pages.save();
		} else {
			self.empleado.enableInput();
			self.empleado.search.clear();

			var addNewButton = self.component.querySelector(".section.conceptos .btn.add-new");
			addNewButton.disabled = false;

			self.pages.save();
		}
	});
}

a9os_app_adminrecibos_main.empresa.reload = () => {
	
	var empresaSelector = self.component.querySelector(".empresa-selector");

	core.sendRequest(
		"/adminrecibos/empresas/get",
		{},
		{
			fn : (response, empresaSelector) => {
				core.preProcess(empresaSelector, { empresas : response });
			},
			args : {
				response : false,
				empresaSelector : empresaSelector
			}
		}
	);
}











a9os_app_adminrecibos_main.empleado = {};
a9os_app_adminrecibos_main.empleado.init = () => {
	var empleadoInput = self.component.querySelector(".section.empleado input");

	var timeout = false;
	a9os_core_main.addEventListener(empleadoInput, "input", (event, empleadoInput) => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = false;
		}
		timeout = setTimeout(() => {
			
			self.empleado.search.search();

			timeout = false;
		}, 500);
	});

}

a9os_app_adminrecibos_main.empleado.enableInput = () => {
	
	self.empleado.search.clear();
	var empleadoInput = self.component.querySelector(".section.empleado input");
	empleadoInput.disabled = false;
	empleadoInput.value = "";

	var empleadoSelected = self.component.querySelector(".section.empleado .empleado-selected");
	empleadoSelected.classList.remove("show");
}

a9os_app_adminrecibos_main.empleado.disableInput = () => {
	
	self.empleado.search.clear();
	var empleadoInput = self.component.querySelector(".section.empleado input");
	empleadoInput.disabled = true;
}


a9os_app_adminrecibos_main.empleado.convertRemuBasica = (empleadoData) => {
	
	if (!empleadoData) return empleadoData;

	empleadoData.remuneracion_basicaInt = empleadoData.remuneracion_basica||0;
	empleadoData.remuneracion_basica = self.money.format(empleadoData.remuneracion_basica||0);
	//if (empleadoData.remuneracion_basica == "$ NaN") debugger;

	return empleadoData;
}








a9os_app_adminrecibos_main.empleado.search = {};
a9os_app_adminrecibos_main.empleado.search.load = (response) => {
	
	var empleadoInput = self.component.querySelector(".section.empleado input");

	if (response.length == 0){
		empleadoInput.setAttribute("data-menu", JSON.stringify([{
			name : "Sin resultados",
			action : ""
		}]));
		a9os_core_main.removeMenu();
		a9os_core_main.showMenu(empleadoInput);
		return;
	} 

	var arrEmpleadosMenu = [];
	for (var i = 0 ; i < response.length ; i++){
		var currEmpleado = response[i];
		arrEmpleadosMenu.push({
			name : currEmpleado.legajo + " - " + currEmpleado.nombre,
			action : "empleado.search.selectFromMenu",
			data :  JSON.parse(currEmpleado.allData)
		});
	} 

	empleadoInput.setAttribute("data-menu", JSON.stringify(arrEmpleadosMenu));
	a9os_core_main.removeMenu();
	a9os_core_main.showMenu(empleadoInput);
}

a9os_app_adminrecibos_main.empleado.search.clear = () => {
		var empleadoInput = self.component.querySelector(".section.empleado input");
	empleadoInput.removeAttribute("data-menu");
}

a9os_app_adminrecibos_main.empleado.search.search = () => {
	
	var empleadoInput = self.component.querySelector(".section.empleado input");
	var empresaSelector = self.component.querySelector(".empresa-selector");
	empleadoInput.value = empleadoInput.value.trim();

	if (empleadoInput.value == "") {
		self.empleado.search.clear();
		return;
	}

	core.sendRequest(
		"/adminrecibos/empleados/search",
		{
			empresa_id : empresaSelector.value,
			name_search : empleadoInput.value
		},
		{
			fn : self.empleado.search.load,
			args : { response : false }
		}
	);
}
a9os_app_adminrecibos_main.empleado.search.selectFromMenu = (event, item, empleadoData) => {
		self.empleado.show(empleadoData);
}

a9os_app_adminrecibos_main.empleado.show = (empleadoData) => {

	var empleadoInput = self.component.querySelector(".section.empleado input");
	empleadoInput.value = "";

	var tmpRemuBasiInt;
	if (empleadoData.remuneracion_basicaInt) tmpRemuBasiInt = empleadoData.remuneracion_basicaInt;

	empleadoData = self.empleado.convertRemuBasica(empleadoData);

	if (tmpRemuBasiInt) empleadoData.remuneracion_basicaInt = tmpRemuBasiInt;


	var empleadoSelected = self.component.querySelector(".section.empleado .empleado-selected");
	empleadoSelected.classList.add("show");
	empleadoData.allData = JSON.stringify(empleadoData);
	core.preProcess(empleadoSelected, { empleado : empleadoData });


	var nextBtn = self.component.querySelector(".toolbar .pages-section .buttons .next");
	nextBtn.disabled = false;

	var borrarBtn = self.component.querySelector(".toolbar .pages-section .buttons .delete");
	borrarBtn.disabled = false;


	if (!empleadoData.id) empleadoSelected.classList.remove("show");

	self.conceptos.recalculate();
	self.empleado.search.clear();

	self.pages.save();
}








a9os_app_adminrecibos_main.banco = {};
a9os_app_adminrecibos_main.banco.init = () => {
	var section = self.component.querySelector(".section.banco");
	a9os_core_main.addEventListener(section.querySelectorAll("input"), "input", self.pages.save);
}

a9os_app_adminrecibos_main.banco.get = () => {
	var section = self.component.querySelector(".section.banco");

	return {
		banco : section.querySelector("input.banco").value,
		periodo : section.querySelector("input.periodo").value,
		fecha : section.querySelector("input.fecha").value,
		fechaPago : section.querySelector("input.fechaPago").value,
		lugarPago : section.querySelector("input.lugarPago").value,
		periodoliq : section.querySelector("input.periodoliq").value,
	}
}

a9os_app_adminrecibos_main.banco.set = (bancoData) => {
	
	var section = self.component.querySelector(".section.banco");
	core.preProcess(section, { banco : bancoData });
}











a9os_app_adminrecibos_main.conceptos = {};
a9os_app_adminrecibos_main.conceptos.init = () => {
	
	var addNewButton = self.component.querySelector(".section.conceptos .btn.add-new");
	a9os_core_main.addEventListener(addNewButton, "click", self.conceptos.createNew);

	self.conceptos.search.init();
}

a9os_app_adminrecibos_main.conceptos.createNew = () => {
	
	var empresaSelector = self.component.querySelector(".empresa-selector");
	var arrEmpresaInfo = {
		id : empresaSelector.value,
		nombre : empresaSelector.options[empresaSelector.selectedIndex].textContent
	};

	var addNewPostCCI = a9os_core_main.windowCrossCallback.add({
		fn : self.conceptos.createNewPost,
		args : {
			arrNewConceptoData : []
		}
	}, self.component);

	core.link.push("/adminrecibos/conceptos/add", {
		empresaInfo : arrEmpresaInfo,
		cci : addNewPostCCI
	});
}

a9os_app_adminrecibos_main.conceptos.createNewPost = (arrNewConceptoData) => {
	
	self.conceptos.add(arrNewConceptoData);
}

a9os_app_adminrecibos_main.conceptos.add = (arrConceptoData) => {
	
	var arrConceptoData = self.conceptos.calculateValores(arrConceptoData);
	
	if (!self.component.arrConceptos) self.component.arrConceptos = [];
	self.component.arrConceptos.push(arrConceptoData);

	self.conceptos.processGui();

	var conceptoInput = self.component.querySelector(".section.conceptos .add .detalle .search");
	conceptoInput.value = "";

}

a9os_app_adminrecibos_main.conceptos.attachTableActions = () => {
	
	var conceptosTable = self.component.querySelector(".section.conceptos table tbody");

	// delete row actions
	var arrBorrarBtns = conceptosTable.querySelectorAll(".btn.borrar");
	a9os_core_main.addEventListener(arrBorrarBtns, "click", (event, borrarBtn) => {
		self.component.arrConceptos.splice(parseInt(borrarBtn.getAttribute("data-index")), 1);
		self.conceptos.processGui();
	});



	//.editable double click edit

	for (var i = 0 ; i < self.component.arrConceptos.length ; i++){
		var currConcepto = self.component.arrConceptos[i];
		if (currConcepto.use_qty == 1) {
			var tdCantidad = conceptosTable.querySelector("tr[data-index='"+i+"'] td.cantidad");
			tdCantidad.classList.add("editable");
			a9os_core_main.addEventListener(tdCantidad, "click", addEditClass);
		}

		if (currConcepto.type == "none") {
			var tdRemuDed = conceptosTable.querySelectorAll("tr[data-index='"+i+"'] td.remuneracion, tr[data-index='"+i+"'] td.deduccion");
			tdRemuDed.forEach((elem) => {
				elem.classList.add("editable");
			});
			a9os_core_main.addEventListener(tdRemuDed, "click", addEditClass);
		}
	}

	function addEditClass(event, currTd) {
		currTd.classList.add("edit");
	}


	//custom value ok buttons
	var arrSubmitBtns = conceptosTable.querySelectorAll(".btn.submit");
	a9os_core_main.addEventListener(arrSubmitBtns, "click", self.conceptos.submitEditField);
}

a9os_app_adminrecibos_main.conceptos.submitEditField = (event, currSubmitBtn) => {
	
	var currTd = currSubmitBtn.parentElement;

	var currIndex = currTd.parentElement.getAttribute("data-index");
	var submitType = currSubmitBtn.getAttribute("data-type");

	currTd.classList.remove("edit");

	var newQty = 0;
	var newValue = 0;
	if (submitType == "cantidad") {
		newQty = parseFloat(currTd.querySelector("input").value);
		self.component.arrConceptos[currIndex].cantidad = newQty||0;

	} else if (submitType == "remuneracion") {
		var deduccionTd = currTd.parentElement.querySelector(".deduccion");
		deduccionTd.classList.remove("edit");
		newValue = parseFloat(currTd.querySelector("input").value);

		self.component.arrConceptos[currIndex].valor = newValue;
	} else if (submitType == "deduccion") {
		var remuneracionTd = currTd.parentElement.querySelector(".remuneracion");
		remuneracionTd.classList.remove("edit");
		newValue = -parseFloat(currTd.querySelector("input").value);
		
		self.component.arrConceptos[currIndex].valor = newValue;
	}
	self.conceptos.recalculate();
	self.conceptos.processGui();
}

a9os_app_adminrecibos_main.conceptos.processGui = () => {
	
	var conceptosTable = self.component.querySelector(".section.conceptos table tbody");
	self.conceptos.calculateIndexes();
	core.preProcess(conceptosTable, { conceptos : self.component.arrConceptos });
	self.conceptos.processTotals();
	self.conceptos.attachTableActions();

	self.pages.save();
}

a9os_app_adminrecibos_main.conceptos.calculateIndexes = () => {
	
	for (var i = 0 ; i < self.component.arrConceptos.length ; i++){
		self.component.arrConceptos[i].index = i;
	}
}

a9os_app_adminrecibos_main.conceptos.calculateValores = (arrConceptoData) => {
	
	arrConceptoData.deduccion = getValor(0, arrConceptoData.type);
	arrConceptoData.deduccionInt = getValor(0, arrConceptoData.type, true);
	arrConceptoData.remuneracion = getValor(0, arrConceptoData.type);
	arrConceptoData.remuneracionInt = getValor(0, arrConceptoData.type, true);


	var finalQty = 1;
	if (arrConceptoData.use_qty && arrConceptoData.cantidad > 1) finalQty = parseFloat(arrConceptoData.cantidad);
	var finalValue = arrConceptoData.valor * finalQty;

	if (arrConceptoData.valor < 0) {
		arrConceptoData.deduccion = getValor(finalValue, arrConceptoData.type);
		arrConceptoData.deduccionInt = getValor(finalValue, arrConceptoData.type, true);
		arrConceptoData.remuneracionInt = -getValor(finalValue, arrConceptoData.type, true);
	} else {
		arrConceptoData.remuneracion = getValor(finalValue, arrConceptoData.type);
		arrConceptoData.remuneracionInt = getValor(finalValue, arrConceptoData.type, true);
		arrConceptoData.deduccionInt = -getValor(finalValue, arrConceptoData.type, true);
	}

	function getValor(valor, type, directInt) {
		if (type == "fixed" || type == "none") {
			if (directInt) return Math.abs(valor);
			else return self.money.format(Math.abs(valor));
		} else {
			var empleadoData = JSON.parse(
				self.component.querySelector(".section.empleado  .empleado-selected").getAttribute("data-alldata")
			);

			if (!empleadoData) {
				if (directInt) return 0;
				else return "--";
			}
			var remuBasica = parseFloat(empleadoData.remuneracion_basicaInt);

			var valorFinal = remuBasica/100*valor;
			if (isNaN(valorFinal)) {
				if (directInt) return 0;
				else return "--";
			}

			if (directInt) return Math.abs(valorFinal);
			else return self.money.format(Math.abs(valorFinal));
		}
	}

	return arrConceptoData;
}

a9os_app_adminrecibos_main.conceptos.recalculate = () => {
	
	self.component.arrConceptos = self.component.arrConceptos||[];
	for (var i = 0 ; i < self.component.arrConceptos.length ; i++){
		self.component.arrConceptos[i] = self.conceptos.calculateValores(self.component.arrConceptos[i]);
	}
	
	self.conceptos.processGui();
	self.pages.save();
}

a9os_app_adminrecibos_main.conceptos.processTotals = () => {
	
	if (!self.component.arrTotales) self.component.arrTotales = [];

	var totalRemumeracion = 0;
	var totalDeduccion = 0;
	var totalNeto = 0;

	var arrConceptos = self.component.arrConceptos;

	for (var i = 0 ; i < arrConceptos.length ; i++){
		if (arrConceptos[i].remuneracionInt && arrConceptos[i].remuneracionInt > 0) {
			totalRemumeracion += arrConceptos[i].remuneracionInt;
		}

		if (arrConceptos[i].deduccionInt && arrConceptos[i].deduccionInt > 0) {
			totalDeduccion += arrConceptos[i].deduccionInt;
		}
	}

	totalNeto = totalRemumeracion - totalDeduccion;

	self.component.arrTotales = {
		remuneracion : self.money.format(totalRemumeracion),
		deduccion : self.money.format(totalDeduccion),
		neto : self.money.format(totalNeto),
		netoTexto : a9os_app_adminrecibos_lib_numbertotext.convert(totalNeto)
	};

	if (!self.component.arrPages[self.component.currPageNumber-1]) self.component.arrPages[self.component.currPageNumber-1] = {};
	self.component.arrPages[self.component.currPageNumber-1].total = self.component.arrTotales;

	var conceptosTable = self.component.querySelector(".section.conceptos table tbody");
	core.preProcess(conceptosTable, { total : self.component.arrTotales });
}













a9os_app_adminrecibos_main.conceptos.search = {};
a9os_app_adminrecibos_main.conceptos.search.init = () => {
	var conceptoInput = self.component.querySelector(".section.conceptos .add .detalle .search");

	var timeout = false;
	a9os_core_main.addEventListener(conceptoInput, "keyup", (event, conceptoInput) => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = false;
		}
		timeout = setTimeout(() => {
			self.conceptos.search.search();	
			timeout = false;
		}, 500);
	});
}

a9os_app_adminrecibos_main.conceptos.search.search = () => {
	
	var conceptoInput = self.component.querySelector(".section.conceptos .add .detalle .search");
	var empresaSelector = self.component.querySelector(".empresa-selector");
	conceptoInput.value = conceptoInput.value.trim();

	if (conceptoInput.value == "" || empresaSelector.value == "0") {
		self.conceptos.search.clear();
		return;
	}

	core.sendRequest(
		"/adminrecibos/conceptos/search",
		{
			empresa_id : empresaSelector.value,
			detalle_search : conceptoInput.value
		},
		{
			fn : self.conceptos.search.load,
			args : { response : false }
		}
	);
}

a9os_app_adminrecibos_main.conceptos.search.clear = () => {
	
	var conceptoInput = self.component.querySelector(".section.conceptos .add .detalle .search");
	conceptoInput.removeAttribute("data-menu");
}

a9os_app_adminrecibos_main.conceptos.search.selectFromMenu = (event, input, conceptoData) => {
	
	self.conceptos.search.clear();

	self.conceptos.add(conceptoData);
}

a9os_app_adminrecibos_main.conceptos.search.load = (response) => {
	
	var conceptoInput = self.component.querySelector(".section.conceptos .add .detalle .search");
	if (response.length == 0){
		conceptoInput.setAttribute("data-menu", JSON.stringify([{
			name : "Sin resultados",
			action : ""
		}]));
		a9os_core_main.removeMenu();
		a9os_core_main.showMenu(conceptoInput);
		return;
	} 

	var arrConceptosMenu = [];
	for (var i = 0 ; i < response.length ; i++){
		var currConcepto = response[i];
		arrConceptosMenu.push({
			name : currConcepto.id + " - " + currConcepto.detalle,
			action : "conceptos.search.selectFromMenu",
			data :  JSON.parse(currConcepto.allData)
		});
	} 

	conceptoInput.setAttribute("data-menu", JSON.stringify(arrConceptosMenu));
	a9os_core_main.removeMenu();
	a9os_core_main.showMenu(conceptoInput);

	return;
}

















a9os_app_adminrecibos_main.project = {};
a9os_app_adminrecibos_main.project.open = () => {
		a9os_app_vf_main.fileHandle.open(self.component, self.component.projectFileHandleId);
}

a9os_app_adminrecibos_main.project.save = () => {
		a9os_app_vf_main.fileHandle.save(self.component, self.component.projectFileHandleId, {
		fn : (handle) => {
			// setFileModified false
		},
		args : {
			handle : false
		}
	});
}

a9os_app_adminrecibos_main.project.saveAs = () => {
		a9os_app_vf_main.fileHandle.saveAs(self.component, self.component.projectFileHandleId, {
		fn : (handle) => {
			// setFileModified false
		},
		args : {
			handle : false
		}
	});
}

a9os_app_adminrecibos_main.project.handle = () => {
	
	self.component.projectFileHandleId = a9os_app_vf_main.fileHandle.attach(
		self.component,
		{
			fn : self.project.getConfigData,
			args : {
				component : self.component
			}
		},
		{
			fn : self.project.putFileData,
			args : {
				component : self.component
			}
		},
		{			
			fn : self.project.getFileData,
			args : {
				component : self.component,
				handle : false
			}
		},
		{
			fn : self.project.getIsFileModified,
			args : {
				component : self.component
			}
		},
		{
			fn : self.project.requestFileReload,
			args : {
				component : self.component,
				handle : false,
				registry : false,
				confirmCallback : false
			}
		},
		{ //cancelFn
			fn : a9os_core_main.selectWindow,
			args : {
				component : self.component
			}
		}
	);
	self.component.querySelector(".toolbar .file-section").setAttribute("data-vf-drop-area", self.component.projectFileHandleId);

	self.component.fileName = "untitled";
	var originalTitle = a9os_core_window.getWindowData()["originalTitle"];
	var arrWindowTitle = [self.component.fileName, originalTitle];

	a9os_core_window.updateWindowData({ title : arrWindowTitle.join(" - ") });
}

a9os_app_adminrecibos_main.project.getConfigData = (component) => {
	
	return { qty : "simple", type : "file", fileExtensions : self.component.fileExtensions, dropType : "single" };
}

a9os_app_adminrecibos_main.project.putFileData = (component) => {
	
	var arrOutput = [];

	for (var i = 0 ; i < component.arrPages.length ; i++) {
		var currPage = component.arrPages[i];
		if (Object.keys(currPage.empleado) == 0) continue;

		var arrConceptoIds = [];
		if (!currPage.conceptos) continue;
		for (var j = 0 ; j < currPage.conceptos.length ; j++){
			var currConcepto = currPage.conceptos[j];

			var arrProcessedConcepto = {};
			arrProcessedConcepto.id = currConcepto.id;

			if (currConcepto.type == "none") arrProcessedConcepto.valor = currConcepto.valor;

			if (currConcepto.use_qty) arrProcessedConcepto.cantidad = currConcepto.cantidad;

			arrConceptoIds.push(arrProcessedConcepto);
		} 

		arrOutput.push({
			empresa_id : currPage.empresa_id,
			empleado_id : currPage.empleado.id,
			banco : currPage.banco,
			conceptos : arrConceptoIds,
			total : component.arrPages[i].total
		});
	}

	self.project.setIsProjectModified(component, false);

	return JSON.stringify(arrOutput);
}

a9os_app_adminrecibos_main.project.getFileData = (component, handle) => {
	
	if (!handle.data) return false;

	var projectSection = component.querySelector(".toolbar .file-section");
	var arrPathName = a9os_core_main.splitFilePath(handle.path);
	core.preProcess(projectSection, { proyecto : { filename : arrPathName[1], path : handle.path } });

	self.component.fileName = arrPathName[1];


	var originalTitle = a9os_core_window.getWindowData()["originalTitle"];
	var arrWindowTitle = [self.component.fileName, originalTitle];
	a9os_core_window.updateWindowData({ title : arrWindowTitle.join(" - ") });

	var reader = new FileReader();
	reader.readAsText(handle.data);
	reader.onload = function() {
		var fileText = reader.result;
		self.project.loadFileData(JSON.parse(fileText));
	}
}

a9os_app_adminrecibos_main.project.getIsFileModified = (component) => {
	return self.component.isProjectModified||false;
}

a9os_app_adminrecibos_main.project.requestFileReload = (component, handle, registry, confirmCallback) => {
	return; //TODO!!
}

a9os_app_adminrecibos_main.project.setIsProjectModified = (component, modified) => {
	var component = component||self.component;
	if (typeof modified === "undefined") modified = true;

	component.isProjectModified = modified;

	if (modified == true) {
		var originalTitle = a9os_core_window.getWindowData()["originalTitle"];
		var arrWindowTitle = [self.component.fileName+"*", originalTitle];
		a9os_core_window.updateWindowData({ title : arrWindowTitle.join(" - ") });
	} else {
		var originalTitle = a9os_core_window.getWindowData()["originalTitle"];
		var arrWindowTitle = [self.component.fileName, originalTitle];
		a9os_core_window.updateWindowData({ title : arrWindowTitle.join(" - ") });
	}
}

a9os_app_adminrecibos_main.project.loadFileData = (arrFileData) => {
	
	core.sendRequest(
		"/adminrecibos/processProjectFile",
		arrFileData,
		{
			fn : (response, component) => {
				component.arrPages = response;
				component.currPageNumber = 1;
				self.pages.loadPage(component.currPageNumber);
				self.conceptos.recalculate();
				self.pages.refreshPageIndicator();
				self.empleado.enableInput();

				var empleadoSelected = component.querySelector(".section.empleado .empleado-selected");
				empleadoSelected.classList.add("show");

				self.project.setIsProjectModified(component, false);
			},
			args : {
				response : false,
				component : self.component
			}
		}
	);
	return;
}

a9os_app_adminrecibos_main.project.enableSave = () => {
	var saveBtn = self.component.querySelector(".toolbar .save-file");
	if (saveBtn.disabled == false) return;

	saveBtn.disabled = false;

	var arrMenuBar = a9os_core_window.getMenuBar();

	for (var i = 0 ; i < arrMenuBar["Archivo"].length ; i++) {
		if (arrMenuBar["Archivo"][i].action == "project.save" || arrMenuBar["Archivo"][i].action == "project.saveAs") 
			arrMenuBar["Archivo"][i].active = true;
	}

	a9os_core_window.setMenuBar(arrMenuBar);

	self.pdf.enableExport();
}

/* FILE
[
	{
		empresa_id : 45,
		empleado_id : 180,
		pago : {
			banco : "",
			periodo : "",
			fecha : "",
			fechaPago : "";
			lugarPago : ""
		}
		conceptos : [12,15,16,18]
	},
]
*/







a9os_app_adminrecibos_main.money = {};
a9os_app_adminrecibos_main.money.format = (int) => {
	if (!parseFloat(int)) return int;
	var moneyFormat = new Intl.NumberFormat('es-AR', {
		style: 'currency',
		currency: 'ARS',
		minimumFractionDigits: 2
	});

	return moneyFormat.format(int);
}







a9os_app_adminrecibos_main.pdf = {};
a9os_app_adminrecibos_main.pdf.handle = () => {
	
	self.component.pdfFileHandleId = a9os_app_vf_main.fileHandle.attach(
		self.component,
		{
			fn : (c) => { // gecoda

				function getYMD() {
					var d = new Date();
					return d.getFullYear().toString()+"-"+
						d.getMonth().toString()+"-"+
						d.getDate().toString();
				}

				return { 
					fileExtensions : ["PDF"],
					fileName : "adminrecibos_export_"+getYMD()+".pdf"
				};
			},
			args : {
				c : self.component
			}
		},
		{
			fn : (component) => { //pufida
				return component.pdfFile;
			},
			args : {
				c : self.component
			}
		},
		false,
		false,
		false,
		{ //cancelFn
			fn : a9os_core_main.selectWindow,
			args : {
				component : self.component
			}
		}
	);
}

a9os_app_adminrecibos_main.pdf.export = () => {
	
	core.sendRequest(
		"/adminrecibos/export-pdf",
		self.component.arrPages,
		{
			fn : (response, component) => {
				component.pdfFile = response;
				a9os_app_vf_main.fileHandle.saveAs(component, component.pdfFileHandleId, {
					fn : (handle) => {
						a9os_core_taskbar_popuparea.new("PDF guardado en: <br>" + handle.path);
					},
					args : {
						handle : false,
						component : self.component
					}
				});
			}, 
			args : {
				response : false,
				component : self.component
			}
		},
		true
	);
}



a9os_app_adminrecibos_main.pdf.enableExport = () => {
	var exportBtn = self.component.querySelector(".toolbar .export-pdf");
	if (exportBtn.disabled == false) return;

	exportBtn.disabled = false;

	var arrMenuBar = a9os_core_window.getMenuBar();

	for (var i = 0 ; i < arrMenuBar["Archivo"].length ; i++) {
		if (arrMenuBar["Archivo"][i].action == "pdf.export") 
			arrMenuBar["Archivo"][i].active = true;
	}

	a9os_core_window.setMenuBar(arrMenuBar);

}










a9os_app_adminrecibos_main.configWindows = {};
a9os_app_adminrecibos_main.configWindows.openEmpresas = () => {
	
	core.link.push("/adminrecibos/admin/empresas", {
		cci : a9os_core_main.windowCrossCallback.add({
			fn : a9os_app_adminrecibos_main.configWindows.postActions,
			args : {
				configType : "empresas"
			}
		}, self.component)
	});
}

a9os_app_adminrecibos_main.configWindows.openEmpleados = () => {
		
	core.link.push("/adminrecibos/admin/empleados", {
		cci : a9os_core_main.windowCrossCallback.add({
			fn : a9os_app_adminrecibos_main.configWindows.postActions,
			args : {
				configType : "empleados"
			}
		}, self.component)
	});
}

a9os_app_adminrecibos_main.configWindows.postActions = (configType) => {
	
	if (configType == "empresas") {
		self.empresa.reload();
	} else {
		self.empleado.search.clear();
	}
}