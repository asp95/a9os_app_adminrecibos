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

class a9os_app_adminrecibos_pdf extends a9os_app_vf_main {
	public function main($data){
		$arrRecibosData = $data["data"];

		$pageNum = 0;
		foreach ($arrRecibosData as $currPage) {
			$this->addPage();
			$this->addEmpresa($currPage["empresa_id"]);
			$this->addEmpleado($currPage["empleado"]);
			$this->addBanco($currPage["banco"]);

			$this->addConceptos($currPage["conceptos"]);
			$this->addTotales($currPage["total"]);

			$pageNum++;
		}


		return $this->returnPdf();
	}

	public function getTemplateCoords(){
		if (!empty(parent::getTemplateCoords())) return parent::getTemplateCoords();

		$jsonCoords = file_get_contents($this->getCore()->getResource("a9os/app/adminrecibos/pdf/template_coords.json"));
		$jsonCoords = str_replace(["\t", "\n"], "", $jsonCoords);
		$templateCoords = json_decode($jsonCoords, true);

		$this->setTemplateCoords($templateCoords);
		return $templateCoords;
	}

	public function addPage(){
		if (!$this->getPdfDocument()) {
			$this->setPdfDocument($this->getCore()->getModel("a9os.app.adminrecibos.fpdf.bind")->new());
		}
		$pdf = $this->getPdfDocument();

		$pdf->AddPage();
		$pdf->SetFont("Courier", "", 9);
		$pdf->SetMargins(0,0,0);
		$pdf->SetAutoPageBreak(false, 0);
		$pdf->Image($this->getCore()->getResource("a9os/app/adminrecibos/pdf/template.png"),0,0,210, 297);
		return $this;
	}

	public function getCoordsItem($arrData, $keyName){
		$arrKeyName = explode(".", $keyName);
		$arrOutput = $arrData;
		foreach ($arrKeyName as $currKey) {
			if (!isset($arrOutput[$currKey])) return false;
			$arrOutput = $arrOutput[$currKey];
		}

		return $arrOutput;
	}

	public function printInPage($keyName, $arrData, $multiLineH = 0){
		$arrTemplateCoords = $this->getTemplateCoords();
		$currTemplateCoords = $this->getCoordsItem($arrTemplateCoords, $keyName);

		if (!isset($currTemplateCoords)) return false;
		if ($keyName == "conceptos.line") error_log(var_export($currTemplateCoords, true));
		foreach ($currTemplateCoords as $k => $currCoord) {
			if (!isset($arrData[$k])) continue;
			$this->fCell(
				"Courier",
				$currCoord[4],
				$currCoord[6],

				$currCoord[0],
				$currCoord[1] + $multiLineH,
				$currCoord[2],
				$currCoord[3],
				$currCoord[5],
				$arrData[$k]
			);

			$this->fCell(
				"Courier",
				$currCoord[4],
				$currCoord[6],

				$currCoord[0],
				$currCoord[1] + $arrTemplateCoords["midPageMM"] + $multiLineH,
				$currCoord[2],
				$currCoord[3],
				$currCoord[5],
				$arrData[$k]
			);
		}
	}

	public function addEmpresa($empresaId){
		$currEmpresa = $this->getCore()->getModel("a9os.app.adminrecibos.admin.empresas")->load((int)$empresaId);
		if (!$currEmpresa) return false;

		$currEmpresaData = $currEmpresa->getData();
		$currEmpresaData["cuit"] = "C.U.I.T.: ".$currEmpresaData["cuit"];

		$this->printInPage("empresa", $currEmpresaData);
		return true;
	}

	public function addEmpleado($arrEmpleadoData){
		$arrEmpleadoData["fecha_ingreso"] = $this->convertFecha($arrEmpleadoData["fecha_ingreso"]);
		$this->printInPage("empleado", $arrEmpleadoData);
		return true;
	}

	public function addBanco($arrBancoData){
		$this->printInPage("banco", $arrBancoData);
		return true;
	}

	public function addConceptos($arrConceptos){
		$arrTemplateCoords = $this->getTemplateCoords();
		$lineH = $this->getCoordsItem($arrTemplateCoords, "conceptos.lineH");
		$lineHSum = 0;

		foreach ($arrConceptos as $currConcepto) {
			$this->printInPage("conceptos.line", $currConcepto, $lineHSum);
			$lineHSum += $lineH;
		}

		return true;
	}
	public function addTotales($arrTotales){
		$this->printInPage("total", $arrTotales);
		return true;
	}

	public function returnPdf(){
		$pdf = $this->getPdfDocument();
		$tmpPath = "/tmp/adminrecibos_tmp.pdf";
		file_put_contents($tmpPath, $pdf->Output("S"));
		$this->returnFile($tmpPath);	
	}


	public function fCell($font, $type, $size, $x, $y, $w, $h, $align, $text, $debug_border=0, $link=false, $color="#000000"){
		$pdf = $this->getPdfDocument();

		$pdf->SetFont($font,$type,$size);
		$pdf->SetXY($x,$y);

		if ($color != "#000000"){
			$tmpDecColor = $this->parseColor($color);
			$pdf->SetTextColor($tmpDecColor[0], $tmpDecColor[1], $tmpDecColor[2]);
		} else {
			$pdf->SetTextColor(0,0,0);
		}

		//$pdf->Cell($w, $h, utf8_decode($text), $debug_border, 0, $align, false, $link);
		$pdf->MultiCell($w, $h, utf8_decode($text), $debug_border, $align, false);
	}

	public function parseColor($hexcolor, $boolReduced = false){
		$p1 = str_replace("#", "", $hexcolor);

		if (strlen($p1) == 6){
			$arrP2 = str_split($p1, 2);
			$arrReturn = [hexdec($arrP2[0]), hexdec($arrP2[1]), hexdec($arrP2[2])];
		} else {
			$arrP2 = str_split($p1);
			$arrReturn = [hexdec($arrP2[0])*16, hexdec($arrP2[1])*16, hexdec($arrP2[2])*16];
		}
		return $arrReturn;
	}

	public function convertFecha($fechaYMD){
		$arrFecha = explode("-", $fechaYMD);
		return $arrFecha[2]."/".$arrFecha[1]."/".$arrFecha[0];
	}

}