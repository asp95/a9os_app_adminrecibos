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
a9os_app_adminrecibos_lib_numbertotext.convert = (num) => {
	
	var strMenos = "";
	if (num < 0) {
		num = Math.abs(num);
		strMenos = "MENOS ";
	}

	var data = {
		numero: num,
		enteros: Math.floor(num),
		centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
		letrasCentavos: "",
		letrasMonedaPlural: 'PESOS',
		letrasMonedaSingular: 'PESO',

		letrasMonedaCentavoPlural: "CENTAVOS",
		letrasMonedaCentavoSingular: "CENTAVO"
	};

	if (data.centavos > 0) {
		data.letrasCentavos = "CON " + (function (){
			if (data.centavos == 1)
				return self.millones(data.centavos) + " " + data.letrasMonedaCentavoSingular;
			else
				return self.millones(data.centavos) + " " + data.letrasMonedaCentavoPlural;
			})();
	};

	if(data.enteros == 0)
		return strMenos + "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
	if (data.enteros == 1)
		return strMenos + self.millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
	else
		return strMenos + self.millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
}

a9os_app_adminrecibos_lib_numbertotext.millones = (num) => {
	
	divisor = 1000000;
	cientos = Math.floor(num / divisor)
	resto = num - (cientos * divisor)

	strMillones = self.seccion(num, divisor, "UN MILLON ", "MILLONES ");
	strMiles = self.miles(resto);

	if (strMiles == "") strMiles += "DE";

	if(strMillones == "")
		return strMiles;

	return strMillones + " " + strMiles;
}

a9os_app_adminrecibos_lib_numbertotext.seccion = (num, divisor, strSingular, strPlural) => {
	
	cientos = Math.floor(num / divisor)
	resto = num - (cientos * divisor)

	letras = "";

	if (cientos > 0)
		if (cientos > 1)
			letras = self.centenas(cientos) + " " + strPlural;
		else
			letras = strSingular;

	if (resto > 0)
		letras += "";

	return letras;
}

a9os_app_adminrecibos_lib_numbertotext.miles = (num) => {
	
	divisor = 1000;
	cientos = Math.floor(num / divisor)
	resto = num - (cientos * divisor)

	strMiles = self.seccion(num, divisor, "UN MIL", "MIL");
	strCentenas = self.centenas(resto);

	if(strMiles == "")
		return strCentenas;

	return strMiles + " " + strCentenas;
}

a9os_app_adminrecibos_lib_numbertotext.centenas = (num) => {
	
	centenas = Math.floor(num / 100);
	decenas = num - (centenas * 100);

	switch(centenas)
	{
		case 1:
			if (decenas > 0)
				return "CIENTO " + self.decenas(decenas);
			return "CIEN";
		case 2: return "DOSCIENTOS " + self.decenas(decenas);
		case 3: return "TRESCIENTOS " + self.decenas(decenas);
		case 4: return "CUATROCIENTOS " + self.decenas(decenas);
		case 5: return "QUINIENTOS " + self.decenas(decenas);
		case 6: return "SEISCIENTOS " + self.decenas(decenas);
		case 7: return "SETECIENTOS " + self.decenas(decenas);
		case 8: return "OCHOCIENTOS " + self.decenas(decenas);
		case 9: return "NOVECIENTOS " + self.decenas(decenas);
	}

	return self.decenas(decenas);
}

a9os_app_adminrecibos_lib_numbertotext.decenas = (num) => {
	
	decena = Math.floor(num/10);
	unidad = num - (decena * 10);

	switch(decena)
	{
		case 1:
			switch(unidad)
			{
				case 0: return "DIEZ";
				case 1: return "ONCE";
				case 2: return "DOCE";
				case 3: return "TRECE";
				case 4: return "CATORCE";
				case 5: return "QUINCE";
				default: return "DIECI" + self.unidades(unidad);
			}
		case 2:
			switch(unidad)
			{
				case 0: return "VEINTE";
				default: return "VEINTI" + self.unidades(unidad);
			}
		case 3: return self.decenasY("TREINTA", unidad);
		case 4: return self.decenasY("CUARENTA", unidad);
		case 5: return self.decenasY("CINCUENTA", unidad);
		case 6: return self.decenasY("SESENTA", unidad);
		case 7: return self.decenasY("SETENTA", unidad);
		case 8: return self.decenasY("OCHENTA", unidad);
		case 9: return self.decenasY("NOVENTA", unidad);
		case 0: return self.unidades(unidad);
	}
}

a9os_app_adminrecibos_lib_numbertotext.decenasY = (strSin, numUnidades) => {
	
	if (numUnidades > 0)
	return strSin + " Y " + self.unidades(numUnidades)

	return strSin;
}

a9os_app_adminrecibos_lib_numbertotext.unidades = (num) => {
	
	switch(num)
	{
		case 1: return "UN";
		case 2: return "DOS";
		case 3: return "TRES";
		case 4: return "CUATRO";
		case 5: return "CINCO";
		case 6: return "SEIS";
		case 7: return "SIETE";
		case 8: return "OCHO";
		case 9: return "NUEVE";
	}

	return "";
}