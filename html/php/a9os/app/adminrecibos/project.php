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

class a9os_app_adminrecibos_project extends a9os_app_adminrecibos_main {
	public function processFile($data){
		$arrFileData = $data["data"];

		$arrReturnAllPages = [];

		foreach ($arrFileData as $currPageData) {		
			$arrReturn = [];

			$arrReturn["empresa_id"] = $currPageData["empresa_id"];

			$currEmpleado = $this->getCore()->getModel("a9os.app.adminrecibos.admin.empleados")->load($currPageData["empleado_id"]);
			if ($currEmpleado) {
				$currEmpleado->setAntiguedad($currEmpleado->getAntiguedad());
				$currEmpleado->setAllData($currEmpleado->getAllData());
				$arrReturn["empleado"] = $currEmpleado->getData();
			}

			$arrReturn["banco"] = $currPageData["banco"];

			$arrReturn["conceptos"] = [];

			$i = 0;
			foreach ($currPageData["conceptos"] as $currConceptoData) {
				$currConcepto = $this->getCore()->getModel("a9os.app.adminrecibos.concepto")->load($currConceptoData["id"]);
				if (!$currConcepto) continue;

				$currConcepto->setIndex($i);

				if (isset($currConceptoData["cantidad"])) $currConcepto->setCantidad($currConceptoData["cantidad"]);
				if (isset($currConceptoData["valor"])) $currConcepto->setValor($currConceptoData["valor"]);

				$arrReturn["conceptos"][] = $currConcepto->getData();

				$i++;
			}

			$arrReturn["total"] = $currPageData["total"];


			$arrReturnAllPages[] = $arrReturn;
		}


		return $arrReturnAllPages;

	}
}