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

class a9os_app_adminrecibos_main extends a9os_core_window {
	public function main($data){
		$app = $this->getAppByPath($data["path"]);
		$arrFileExtensions = $app->getFileExtensions();
		return [
			"window" => array_merge($this->getWindowData($data), [
				"width" => "670px",
				"height" => "600px",
				"windowColor" => "#c2c374"
			]),
			"empresas" => $this->getEmpresas(),
			"fileExtensions" => $arrFileExtensions
		];
	}

	public function getEmpresas($data = false){
		$aaaae = $this->getCore()->getModel("a9os.app.adminrecibos.admin.empresas");
		$aaaae->_setSelect("
			SELECT * from {$aaaae->getTableName()}
		");

		$arrOutput = [];
		while ($currAaaae = $aaaae->fetch()) {
			$arrOutput[] = array_merge($currAaaae->getData(), [
				"allData" => json_encode($currAaaae->getData())
			]);
		}

		return $arrOutput;
	}

	public function getEmpleados($data){
		$empresaId = (int)$data["data"]["empresa_id"];
		$nameSearch = $data["data"]["name_search"]??false;
		$nameSearch = trim(mb_strtolower($nameSearch));

		$nameSearchSql = "";
		if (!empty($nameSearch)) {
			$nameSearch = "%".$nameSearch."%";
			$nameSearchSql = "and nombre like {$this->_quote($nameSearch)}";
		}

		$aaaam = $this->getCore()->getModel("a9os.app.adminrecibos.admin.empleados");
		$aaaae = $this->getCore()->getModel("a9os.app.adminrecibos.admin.empresas");
		$aaaam->_setSelect("
			SELECT * from {$aaaam->getTableName()}
			where {$aaaae->getPrimaryIdx()} = {$empresaId}
			{$nameSearchSql}
		");

		$arrOutput = [];
		while($currAaaam = $aaaam->fetch()){
			$currEmpleadoData = $currAaaam->getData();
			$currEmpleadoData["antiguedad"] = $currAaaam->getAntiguedad();
			$arrOutput[] = array_merge($currEmpleadoData, [
				"allData" => json_encode($currEmpleadoData)
			]);
		}

		return $arrOutput;
	}
}