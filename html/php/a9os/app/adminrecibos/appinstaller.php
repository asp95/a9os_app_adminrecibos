<?php 
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

class a9os_app_adminrecibos_appinstaller extends a9os_core_app_installer_base {
	const arrBaseVersion = [0, 1, 0];
	const arrVersion = [0, 1, 0];
	
	const appName = "Admin. de recibos";
	const iconUrl = "/resources/a9os/app/adminrecibos/icon.svg";

	public function install($appAppObj){
		$protection = $this->_getProtection();
		$protection->callOnlyFrom([
			"whitelist" => ["application_application"]
		]);

		$coreControllerApplication = $this->getCore()->getModel("core.controller.application");
		$coreComponentA9osMain = $this->getCore()->getModel("core.component")->load("a9os_core_main", "component_name");

		//WINDOWS---
		$coreComponentMain = $this->getCore()->getModel("core.component");
		$coreComponentMain->setComponentName("a9os_app_adminrecibos_main");
		$coreComponentMain->setDesignPath(".a9os-main .window > .main-content");
		$coreComponentMain->setDataModel("a9os.app.adminrecibos.main");
		$coreComponentMain->save();

		$coreControllerMain = $this->getCore()->getModel("core.controller");
		$coreControllerMain->setPath("/adminrecibos");
		$coreControllerMain->save();

		$coreControllerComponentMain = $this->getCore()->getModel("core.controller.component");
		$coreControllerComponentMain->setCoreControllerId($coreControllerMain->getID());
		$coreControllerComponentMain->setCoreComponentId($coreComponentA9osMain->getID());
		$coreControllerComponentMain->setOrder(0);
		$coreControllerComponentMain->save();

		$coreControllerComponentMain = $this->getCore()->getModel("core.controller.component");
		$coreControllerComponentMain->setCoreControllerId($coreControllerMain->getID());
		$coreControllerComponentMain->setCoreComponentId($coreComponentMain->getID());
		$coreControllerComponentMain->setOrder(1);
		$coreControllerComponentMain->save();

		$coreControllerApplication->addNew($coreControllerMain, $appAppObj, true);


		$coreComponentEmpresas = $this->getCore()->getModel("core.component");
		$coreComponentEmpresas->setComponentName("a9os_app_adminrecibos_admin_empresas");
		$coreComponentEmpresas->setDesignPath(".a9os-main .window > .main-content");
		$coreComponentEmpresas->setDataModel("a9os.app.adminrecibos.admin.empresas");
		$coreComponentEmpresas->save();

		$coreControllerEmpresas = $this->getCore()->getModel("core.controller");
		$coreControllerEmpresas->setPath("/adminrecibos/admin/empresas");
		$coreControllerEmpresas->save();

		$coreControllerComponentEmpresas = $this->getCore()->getModel("core.controller.component");
		$coreControllerComponentEmpresas->setCoreControllerId($coreControllerEmpresas->getID());
		$coreControllerComponentEmpresas->setCoreComponentId($coreComponentA9osMain->getID());
		$coreControllerComponentEmpresas->setOrder(0);
		$coreControllerComponentEmpresas->save();

		$coreControllerComponentEmpresas = $this->getCore()->getModel("core.controller.component");
		$coreControllerComponentEmpresas->setCoreControllerId($coreControllerEmpresas->getID());
		$coreControllerComponentEmpresas->setCoreComponentId($coreComponentEmpresas->getID());
		$coreControllerComponentEmpresas->setOrder(1);
		$coreControllerComponentEmpresas->save();

		$coreControllerApplication->addNew($coreControllerEmpresas, $appAppObj, false);



		$coreComponentEmpleados = $this->getCore()->getModel("core.component");
		$coreComponentEmpleados->setComponentName("a9os_app_adminrecibos_admin_empleados");
		$coreComponentEmpleados->setDesignPath(".a9os-main .window > .main-content");
		$coreComponentEmpleados->setDataModel("a9os.app.adminrecibos.admin.empleados");
		$coreComponentEmpleados->save();

		$coreControllerEmpleados = $this->getCore()->getModel("core.controller");
		$coreControllerEmpleados->setPath("/adminrecibos/admin/empleados");
		$coreControllerEmpleados->save();

		$coreControllerComponentEmpleados = $this->getCore()->getModel("core.controller.component");
		$coreControllerComponentEmpleados->setCoreControllerId($coreControllerEmpleados->getID());
		$coreControllerComponentEmpleados->setCoreComponentId($coreComponentA9osMain->getID());
		$coreControllerComponentEmpleados->setOrder(0);
		$coreControllerComponentEmpleados->save();

		$coreControllerComponentEmpleados = $this->getCore()->getModel("core.controller.component");
		$coreControllerComponentEmpleados->setCoreControllerId($coreControllerEmpleados->getID());
		$coreControllerComponentEmpleados->setCoreComponentId($coreComponentEmpleados->getID());
		$coreControllerComponentEmpleados->setOrder(1);
		$coreControllerComponentEmpleados->save();

		$coreControllerApplication->addNew($coreControllerEmpleados, $appAppObj, false);


		$coreComponentConceptosPopup = $this->getCore()->getModel("core.component");
		$coreComponentConceptosPopup->setComponentName("a9os_app_adminrecibos_popup_conceptos");
		$coreComponentConceptosPopup->setDesignPath(".a9os-main .window > .main-content");
		$coreComponentConceptosPopup->setDataModel("a9os.app.adminrecibos.popup.conceptos");
		$coreComponentConceptosPopup->save();

		$coreControllerConceptosPopup = $this->getCore()->getModel("core.controller");
		$coreControllerConceptosPopup->setPath("/adminrecibos/conceptos/add");
		$coreControllerConceptosPopup->save();

		$coreControllerComponentConceptosPopup = $this->getCore()->getModel("core.controller.component");
		$coreControllerComponentConceptosPopup->setCoreControllerId($coreControllerConceptosPopup->getID());
		$coreControllerComponentConceptosPopup->setCoreComponentId($coreComponentA9osMain->getID());
		$coreControllerComponentConceptosPopup->setOrder(0);
		$coreControllerComponentConceptosPopup->save();

		$coreControllerComponentConceptosPopup = $this->getCore()->getModel("core.controller.component");
		$coreControllerComponentConceptosPopup->setCoreControllerId($coreControllerConceptosPopup->getID());
		$coreControllerComponentConceptosPopup->setCoreComponentId($coreComponentConceptosPopup->getID());
		$coreControllerComponentConceptosPopup->setOrder(1);
		$coreControllerComponentConceptosPopup->save();

		$coreControllerApplication->addNew($coreControllerConceptosPopup, $appAppObj, false);

		//////////


		//data controllers
		$coreComponentEmpresaSave = $this->getCore()->getModel("core.component");
		$coreComponentEmpresaSave->setDataModel("a9os.app.adminrecibos.admin.empresas::saveEmpresa");
		$coreComponentEmpresaSave->save();

		$coreControllerEmpresaSave = $this->getCore()->getModel("core.controller");
		$coreControllerEmpresaSave->setPath("/adminrecibos/admin/empresas/save");
		$coreControllerEmpresaSave->save();

		$coreControllerComponentEmpresaSave = $this->getCore()->getModel("core.controller.component");
		$coreControllerComponentEmpresaSave->setCoreControllerId($coreControllerEmpresaSave->getID());
		$coreControllerComponentEmpresaSave->setCoreComponentId($coreComponentEmpresaSave->getID());
		$coreControllerComponentEmpresaSave->setOrder(0);
		$coreControllerComponentEmpresaSave->save();

		$coreControllerApplication->addNew($coreControllerEmpresaSave, $appAppObj, false);



		$coreComponentGetEmpleados = $this->getCore()->getModel("core.component");
		$coreComponentGetEmpleados->setDataModel("a9os.app.adminrecibos.admin.empleados::getEmpleados");
		$coreComponentGetEmpleados->save();

		$coreControllerGetEmpleados = $this->getCore()->getModel("core.controller");
		$coreControllerGetEmpleados->setPath("/adminrecibos/admin/empleados/getempleados");
		$coreControllerGetEmpleados->save();

		$coreControllerComponentGetEmpleados = $this->getCore()->getModel("core.controller.component");
		$coreControllerComponentGetEmpleados->setCoreControllerId($coreControllerGetEmpleados->getID());
		$coreControllerComponentGetEmpleados->setCoreComponentId($coreComponentGetEmpleados->getID());
		$coreControllerComponentGetEmpleados->setOrder(0);
		$coreControllerComponentGetEmpleados->save();

		$coreControllerApplication->addNew($coreControllerGetEmpleados, $appAppObj, false);

		$coreControllerEmpleadosSearch = $this->getCore()->getModel("core.controller");
		$coreControllerEmpleadosSearch->setPath("/adminrecibos/empleados/search");
		$coreControllerEmpleadosSearch->save();

		$coreControllerComponentEmpleadosSearch = $this->getCore()->getModel("core.controller.component");
		$coreControllerComponentEmpleadosSearch->setCoreControllerId($coreControllerEmpleadosSearch->getID());
		$coreControllerComponentEmpleadosSearch->setCoreComponentId($coreComponentGetEmpleados->getID());
		$coreControllerComponentEmpleadosSearch->setOrder(0);
		$coreControllerComponentEmpleadosSearch->save();

		$coreControllerApplication->addNew($coreControllerEmpleadosSearch, $appAppObj, false);



		$coreComponentSaveEmpleado = $this->getCore()->getModel("core.component");
		$coreComponentSaveEmpleado->setDataModel("a9os.app.adminrecibos.admin.empleados::saveEmpleado");
		$coreComponentSaveEmpleado->save();

		$coreControllerSaveEmpleado = $this->getCore()->getModel("core.controller");
		$coreControllerSaveEmpleado->setPath("/adminrecibos/admin/empleados/save");
		$coreControllerSaveEmpleado->save();

		$coreControllerComponentSaveEmpleado = $this->getCore()->getModel("core.controller.component");
		$coreControllerComponentSaveEmpleado->setCoreControllerId($coreControllerSaveEmpleado->getID());
		$coreControllerComponentSaveEmpleado->setCoreComponentId($coreComponentSaveEmpleado->getID());
		$coreControllerComponentSaveEmpleado->setOrder(0);
		$coreControllerComponentSaveEmpleado->save();

		$coreControllerApplication->addNew($coreControllerSaveEmpleado, $appAppObj, false);


		$coreComponentGetEmpresa = $this->getCore()->getModel("core.component");
		$coreComponentGetEmpresa->setDataModel("a9os.app.adminrecibos.admin.empresas::getEmpresas");
		$coreComponentGetEmpresa->save();

		$coreControllergetEmpresa = $this->getCore()->getModel("core.controller");
		$coreControllergetEmpresa->setPath("/adminrecibos/empresas/get");
		$coreControllergetEmpresa->save();

		$coreControllerComponentGetEmpresa = $this->getCore()->getModel("core.controller.component");
		$coreControllerComponentGetEmpresa->setCoreControllerId($coreControllergetEmpresa->getID());
		$coreControllerComponentGetEmpresa->setCoreComponentId($coreComponentGetEmpresa->getID());
		$coreControllerComponentGetEmpresa->setOrder(0);
		$coreControllerComponentGetEmpresa->save();

		$coreControllerApplication->addNew($coreControllergetEmpresa, $appAppObj, false);


		$coreComponentConceptosAddnew = $this->getCore()->getModel("core.component");
		$coreComponentConceptosAddnew->setDataModel("a9os.app.adminrecibos.popup.conceptos::addNew");
		$coreComponentConceptosAddnew->save();

		$coreControllerConceptosAddnew = $this->getCore()->getModel("core.controller");
		$coreControllerConceptosAddnew->setPath("/adminrecibos/conceptos/add/submit");
		$coreControllerConceptosAddnew->save();

		$coreControllerComponentConceptosAddnew = $this->getCore()->getModel("core.controller.component");
		$coreControllerComponentConceptosAddnew->setCoreControllerId($coreControllerConceptosAddnew->getID());
		$coreControllerComponentConceptosAddnew->setCoreComponentId($coreComponentConceptosAddnew->getID());
		$coreControllerComponentConceptosAddnew->setOrder(0);
		$coreControllerComponentConceptosAddnew->save();

		$coreControllerApplication->addNew($coreControllerConceptosAddnew, $appAppObj, false);


		$coreComponentConceptoSearch = $this->getCore()->getModel("core.component");
		$coreComponentConceptoSearch->setDataModel("a9os.app.adminrecibos.concepto::search");
		$coreComponentConceptoSearch->save();

		$coreControllerConceptoSearch = $this->getCore()->getModel("core.controller");
		$coreControllerConceptoSearch->setPath("/adminrecibos/conceptos/search");
		$coreControllerConceptoSearch->save();

		$coreControllerComponentConceptoSearch = $this->getCore()->getModel("core.controller.component");
		$coreControllerComponentConceptoSearch->setCoreControllerId($coreControllerConceptoSearch->getID());
		$coreControllerComponentConceptoSearch->setCoreComponentId($coreComponentConceptoSearch->getID());
		$coreControllerComponentConceptoSearch->setOrder(0);
		$coreControllerComponentConceptoSearch->save();

		$coreControllerApplication->addNew($coreControllerConceptoSearch, $appAppObj, false);


		$coreComponentProjectProcessFile = $this->getCore()->getModel("core.component");
		$coreComponentProjectProcessFile->setDataModel("a9os.app.adminrecibos.project::processFile");
		$coreComponentProjectProcessFile->save();

		$coreControllerProjectProcessFile = $this->getCore()->getModel("core.controller");
		$coreControllerProjectProcessFile->setPath("/adminrecibos/processProjectFile");
		$coreControllerProjectProcessFile->save();

		$coreControllerComponentProjectProcessFile = $this->getCore()->getModel("core.controller.component");
		$coreControllerComponentProjectProcessFile->setCoreControllerId($coreControllerProjectProcessFile->getID());
		$coreControllerComponentProjectProcessFile->setCoreComponentId($coreComponentProjectProcessFile->getID());
		$coreControllerComponentProjectProcessFile->setOrder(0);
		$coreControllerComponentProjectProcessFile->save();

		$coreControllerApplication->addNew($coreControllerProjectProcessFile, $appAppObj, false);


		$coreComponentPdf = $this->getCore()->getModel("core.component");
		$coreComponentPdf->setDataModel("a9os.app.adminrecibos.pdf");
		$coreComponentPdf->save();

		$coreControllerPdf = $this->getCore()->getModel("core.controller");
		$coreControllerPdf->setPath("/adminrecibos/export-pdf");
		$coreControllerPdf->save();

		$coreControllerComponentPdf = $this->getCore()->getModel("core.controller.component");
		$coreControllerComponentPdf->setCoreControllerId($coreControllerPdf->getID());
		$coreControllerComponentPdf->setCoreComponentId($coreComponentPdf->getID());
		$coreControllerComponentPdf->setOrder(0);
		$coreControllerComponentPdf->save();

		$coreControllerApplication->addNew($coreControllerPdf, $appAppObj, false);
		/////

		//js lib
		$coreComponentNumbertotext = $this->getCore()->getModel("core.component");
		$coreComponentNumbertotext->setComponentName("a9os_app_adminrecibos_lib_numbertotext");
		$coreComponentNumbertotext->save();

		$coreControllerNumbertotext = $this->getCore()->getModel("core.controller.component");
		$coreControllerNumbertotext->setCoreControllerId($coreControllerMain->getID());
		$coreControllerNumbertotext->setCoreComponentId($coreComponentNumbertotext->getID());
		$coreControllerNumbertotext->setOrder(2);
		$coreControllerNumbertotext->save();
		//////


		$appAppExtension = $this->getCore()->getModel("application.application.extension");
		$appAppExtension->addApplicationExtensions($appAppObj, [
			"ADRP" => [
				"icon_file" => "adminrecibos/adminrecibos-file-icon.svg"
			],
		]);

		return true;
	}
}