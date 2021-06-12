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

class a9os_app_adminrecibos_admin_empresas extends a9os_app_adminrecibos_main {
	public function main($data){
		$app = $this->getAppByPath($data["path"]);
		$arrEmpresas = $this->getEmpresas();
		$arrWindowData = $this->getWindowData($data);
		
		return [
			"window" => array_merge($arrWindowData, [
				"title" => $arrWindowData["title"]." - Administrar empresas",
				"width" => "300px",
				"height" => "550px",
				"windowColor" => "#c2c374"
			]),
			"empresas" => $arrEmpresas
		];
	}

	public function saveEmpresa($data){
		$arrEmpresaInfo = $data["data"];
		
		$empresaToEdit = $this->getCore()->getModel($this);
		if ($arrEmpresaInfo["id"] != "new") {
			$empresaToEdit->load($arrEmpresaInfo["id"]);
		}
		$empresaToEdit->setNombre($arrEmpresaInfo["nombre"]);
		$empresaToEdit->setDescripcion($arrEmpresaInfo["descripcion"]);
		$empresaToEdit->setCuit($arrEmpresaInfo["cuit"]);
		$empresaToEdit->save();

		return $empresaToEdit->getData();
	}



	protected function _manageTable($tableInfo, $tableHandle) {
		$protectionModel = $this->_getProtection();
		if ($protectionModel->restrictToChildClasses(__CLASS__)) return false;

		if ($tableInfo && $tableInfo["version"] && $tableInfo["version"] == 1) return false;

		if (!$tableInfo) {
			$tableHandle->addField("nombre", "varchar(255)", false, false, false, "''");
			$tableHandle->addField("descripcion", "text", false, false, false);
			$tableHandle->addField("cuit", "varchar(50)", false, false, false, "''");
			
			$tableInfo = ["version" => 1];

			$tableHandle->setTableInfo($tableInfo);
			$tableHandle->save();
		}
		return true;
	}
}