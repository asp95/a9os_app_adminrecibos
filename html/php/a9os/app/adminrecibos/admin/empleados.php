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

class a9os_app_adminrecibos_admin_empleados extends a9os_app_adminrecibos_main {
	public function main($data){
		$arrEmpresas = $this->getEmpresas();
		$arrWindowData = $this->getWindowData($data);
		return [
			"window" => array_merge($arrWindowData, [
				"title" => $arrWindowData["title"]." - Administrar empleados",
				"width" => "300px",
				"height" => "550px",
				"windowColor" => "#c2c374"
			]),
			"empresas" => $arrEmpresas
		];
	}



	public function saveEmpleado($data){
		$arrEmpleadoInfo = $data["data"];
		
		$empleadoToEdit = $this->getCore()->getModel($this);
		if ($arrEmpleadoInfo["id"] != "new") {
			$empleadoToEdit->load($arrEmpleadoInfo["id"]);
		}
		$empleadoToEdit->setA9osAppAdminrecibosAdminEmpresasId($arrEmpleadoInfo["empresa_id"]);
		$empleadoToEdit->setNombre($arrEmpleadoInfo["nombre"]);
		$empleadoToEdit->setLegajo($arrEmpleadoInfo["legajo"]);
		$empleadoToEdit->setCuil($arrEmpleadoInfo["cuil"]);
		$empleadoToEdit->setFechaIngreso($arrEmpleadoInfo["fecha_ingreso"]);
		$empleadoToEdit->setRemuneracionBasica($arrEmpleadoInfo["remuneracion_basica"]);
		$empleadoToEdit->setCategoria($arrEmpleadoInfo["categoria"]);
		$empleadoToEdit->save();

		return $empleadoToEdit->getData();
	}

	public function getAntiguedad(){
		if (!$this->getID()) return false;
		$timeFechaIngreso = strtotime($this->getFechaIngreso()." 00:00:00");
		$timeAntiguedad = time() - $timeFechaIngreso;

		return floor($timeAntiguedad/60/60/24/365)." Años";
	}



	protected function _manageTable($tableInfo, $tableHandle) {
		$protectionModel = $this->_getProtection();
		if ($protectionModel->restrictToChildClasses(__CLASS__)) return false;

		if ($tableInfo && $tableInfo["version"] && $tableInfo["version"] == 1) return false;

		if (!$tableInfo) {
			$tableHandle->addField("a9os_app_adminrecibos_admin_empresas_id", "int", false, false, false);
			$tableHandle->addField("nombre", "varchar(255)", false, false, false);
			$tableHandle->addField("legajo", "varchar(30)", false, false, false);
			$tableHandle->addField("cuil", "varchar(30)", false, false, false);
			$tableHandle->addField("fecha_ingreso", "date", false, false, false);
			$tableHandle->addField("remuneracion_basica", "decimal(10,2)", false, false, false);
			$tableHandle->addField("categoria", "varchar(255)", false, false, false);

			$tableHandle->createIndex("a9os_app_adminrecibos_admin_empresas_id", ["a9os_app_adminrecibos_admin_empresas_id"]);
			
			$tableInfo = ["version" => 1];

			$tableHandle->setTableInfo($tableInfo);
			$tableHandle->save();
		}
		return true;
	}
}