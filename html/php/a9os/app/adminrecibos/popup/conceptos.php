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

class a9os_app_adminrecibos_popup_conceptos extends a9os_app_adminrecibos_main {
	public function main($data){
		$arrWindowData = $this->getWindowData($data);

		return [
			"window" => array_merge($arrWindowData, [
				"title" => $arrWindowData["title"]." - Nuevo concepto",
				"resize" => "false",
				"width" => "350px",
				"height" => "auto",
				"position" => "center",
			]),
			"empresaInfo" => json_decode(base64_decode($data["data"]["empresaInfo"]))
		];
	}

	public function addNew($data){
		$arrNewData = $data["data"];

		if (empty($arrNewData["valor"])) $arrNewData["valor"] = 0;

		$newEntry = $this->getCore()->getModel("a9os.app.adminrecibos.concepto");
		$newEntry->setA9osAppAdminrecibosAdminEmpresasId($arrNewData["empresaId"]);
		$newEntry->setDetalle($arrNewData["detalle"]);
		$newEntry->setValor($arrNewData["valor"]);
		$newEntry->setType($arrNewData["type"]);
		$newEntry->setUseQty($arrNewData["use_qty"]);
		$newEntry->save();

		return $newEntry->getData();
	}
}