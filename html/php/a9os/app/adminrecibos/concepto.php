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

class a9os_app_adminrecibos_concepto extends a9os_app_adminrecibos_main {
	public function search($data){
		$empresaId = (int)$data["data"]["empresa_id"];
		$detalleSearch = $data["data"]["detalle_search"]??false;
		$detalleSearch = "%".trim(mb_strtolower($detalleSearch))."%";

		$aaac = $this->getCore()->getModel($this);
		$aaaae = $this->getCore()->getModel("a9os.app.adminrecibos.admin.empresas");
		$aaac->_setSelect("
			SELECT * from {$aaac->getTableName()}
			where {$aaaae->getPrimaryIdx()} = {$empresaId}

			and detalle like {$this->_quote($detalleSearch)}
			or {$aaac->getPrimaryIdx()} like {$this->_quote($detalleSearch)}
		");

		$arrOutput = [];
		while($currAaac = $aaac->fetch()){
			$currConceptoData = $currAaac->getData();
			$arrOutput[] = array_merge($currConceptoData, [
				"allData" => json_encode($currConceptoData)
			]);
		}

		return $arrOutput;
	}

	public function save(){
		$protection = $this->_getProtection();
		$protection->callOnlyFrom([
			"whitelist" => ["a9os_app_adminrecibos_popup_conceptos"]
		]);

		return parent::save();
	}




	protected function _manageTable($tableInfo, $tableHandle) {
		$protectionModel = $this->_getProtection();
		if ($protectionModel->restrictToChildClasses(__CLASS__)) return false;

		if ($tableInfo && $tableInfo["version"] && $tableInfo["version"] == 1) return false;

		if (!$tableInfo) {
			$tableHandle->addField("a9os_app_adminrecibos_admin_empresas_id", "int", false, false, false);
			$tableHandle->addField("detalle", "varchar(255)", false, false, false);
			$tableHandle->addField("valor", "decimal(10,2)", false, false, false);
			$tableHandle->addField("type", "ENUM('percent','fixed','none')", false, false, false);
			$tableHandle->addField("use_qty", "int", false, false, false, "'0'");
			
			$tableInfo = ["version" => 1];

			$tableHandle->setTableInfo($tableInfo);
			$tableHandle->save();
		}
		return true;
	}
}