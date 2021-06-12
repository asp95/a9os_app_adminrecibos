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
a9os_app_adminrecibos_popup_conceptos.main = (data) => {
	if (data.window) a9os_core_window.processWindowData(data);
	
	self.attachRadioActions();
	self.attachInputActions();
	self.attachButtonActions();
}

a9os_app_adminrecibos_popup_conceptos.radioTypeValue = "fixed";

a9os_app_adminrecibos_popup_conceptos.attachRadioActions = () => {
	
	var arrRadioButtons = self.component.querySelectorAll(".line.type input");
	a9os_core_main.addEventListener(arrRadioButtons, "click", (event, currRadio) => {

		var percentSpan = self.component.querySelector(".line.valor span.percent");
		var fixedSpan = self.component.querySelector(".line.valor span.fixed");
		var valorInput = self.component.querySelector(".line.valor input");

		if (currRadio.value == "percent") {
			percentSpan.classList.add("show");
			fixedSpan.classList.remove("show");
			valorInput.disabled = false;
		} else if (currRadio.value == "fixed") {
			percentSpan.classList.remove("show");
			fixedSpan.classList.add("show");
			valorInput.disabled = false;
		} else {
			percentSpan.classList.remove("show");
			fixedSpan.classList.remove("show");
			valorInput.disabled = true;

			var submitBtn = self.component.querySelector(".btn.submit");
			submitBtn.disabled = false;
		}

		self.radioTypeValue = currRadio.value;
	});
}

a9os_app_adminrecibos_popup_conceptos.attachInputActions = () => {
	
	var arrInputs = self.component.querySelectorAll("input");
	a9os_core_main.addEventListener(arrInputs, "keyup", (event, _currInput) => {
		var disabled = false;
		for (var i = 0 ; i < arrInputs.length ; i++){
			var currInput = arrInputs[i];
			if (currInput.value.trim() == "" && currInput.disabled == false) {
				disabled = true;
				break;
			}
		}

		var submitBtn = self.component.querySelector(".btn.submit");
		submitBtn.disabled = disabled;
	});
}

a9os_app_adminrecibos_popup_conceptos.attachButtonActions = () => {
	
	var submitBtn = self.component.querySelector(".btn.submit");
	var cancelBtn = self.component.querySelector(".btn.cancel");

	a9os_core_main.addEventListener(submitBtn, "click", self.submit);
	a9os_core_main.addEventListener(cancelBtn, "click", self.cancel);
}

a9os_app_adminrecibos_popup_conceptos.cancel = (event) => {
	a9os_core_window.close();
}

a9os_app_adminrecibos_popup_conceptos.submit = () => {
	
	var arrNewConcepto = {
		empresaId : self.component.querySelector(".line.empresa").getAttribute("data-id"),
		detalle : self.component.querySelector(".line.detalle input").value,
		valor : self.component.querySelector(".line.valor input").value,
		type : self.radioTypeValue,
		use_qty : (self.component.querySelector(".line.qty input").checked?"1":"0")
	};

	core.sendRequest(
		"/adminrecibos/conceptos/add/submit",
		arrNewConcepto,
		{
			fn : (response) => {
				var postCci = core.link.hash.get()["cci"];
				a9os_core_main.windowCrossCallback.execute(postCci, {
					arrNewConceptoData : response
				});
				a9os_core_window.close();
			},
			args : {
				response : false
			}
		}
	);
}