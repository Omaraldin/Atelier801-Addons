// ==UserScript==
// @name         Atelier801 BBCode Auto Preview
// @namespace    http://atelier801.com/
// @version      1.0
// @description  Auto preview bbcode message for Atelier801 forums
// @author       Omaraldin Khashab (Discord: Omaraldin#4171)
// @match        https://atelier801.com/*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	let elementId = $('#message_reponse').length ? 'message_reponse' : $('#presentation').length ? 'presentation' : $('#message_conversation').length ? 'message_conversation' : '',
		messageElement = $(`#${elementId}`),
		bbcodeElements = $(`#outils_${elementId}`),
		previewElement = $(`#previsualisation_${elementId}`);

	let flags = ["sa", "gb", "fr", "br", "es", "tr", "pl", "hu", "ro", "vk", "nl", "de", "id", "ru", "cn", "ph", "lt", "jp", "fi", "il", "it", "cz", "hr", "sk", "bg", "lv", "ee", "xx"];

	if (messageElement.length && localStorage.getItem("autoPreview") === 'true')
		$('#previsualisation_message_reponse').html(`<div class='cadre cadre-message cadre-previsualisation'>${convertBBCode2HTML(messageElement.val())}</div>`);

	if (bbcodeElements.length)
		bbcodeElements.append(`<div class="btn-group groupe-boutons-barre-outils"><button type="button" id="enableAutoPreview" class="btn btn-reduit btn-${localStorage.getItem("autoPreview") === 'true' ? "danger" : "post"}" onclick="previsualisationMessage('${elementId}', 'cadre-message');">${localStorage.getItem("autoPreview") === 'true' ? "Disable": "Enable"} Live Preview</button></div>`);
	$("#enableAutoPreview").click(function() {
		localStorage.setItem("autoPreview", localStorage.getItem("autoPreview") !== "true" ? "true" : "false");
		$("#enableAutoPreview").html(`${localStorage.getItem("autoPreview") === 'true' ? "Disable": "Enable"} Live Preview`);
		$("#enableAutoPreview").attr("class", `btn btn-reduit btn-${localStorage.getItem("autoPreview") === 'true' ? "danger" : "post"}`);

	});

	messageElement.bind('propertychange input', function () {
		let cadre = elementId !== 'presentation' ? 'message' : 'presentation';
		if (localStorage.getItem("autoPreview") === 'true')
			previewElement.html(`<div class='cadre cadre-${cadre} cadre-previsualisation'>${convertBBCode2HTML(this.value)}</div>`);
	});

	function convertBBCode2HTML(msg, tdColor='') {
		let tabs = [];
		msg = msg.replace(/\[hr]/gim, '<hr>');

		msg = msg.replace(/\n/gim, '<br>');

		// BOLD
		msg = msg.replace(/\[[bB]]/gim, "<span style='font-weight:bold;'>");
		msg = msg.replace(/\[\/[bB]]/gim,"</span>");

		// LINE THROUGH
		msg = msg.replace(/\[[sS]]/gim,"<span style='text-decoration:line-through;'>");
		msg = msg.replace(/\[\/[sS]]/gim,"</span>");

		// UNDER LINE
		msg = msg.replace(/\[[uU]]/gim,"<span style='text-decoration:underline;'>");
		msg = msg.replace(/\[\/[uU]]/gim,"</span>");

		// ITALIC
		msg = msg.replace(/\[[iI]]/gim,"<span style='font-style:italic;'>");
		msg = msg.replace(/\[\/[iI]]/gim,"</span>");

		// COLOR
		msg = msg.replace(/\[color=#([a-fA-F0-9]{1,6}){1,2}]/gim,"<span style='color:#$1'>");
		msg = msg.replace(/\[\/color]/gim,"</span>");

		// FONT SIZE
		msg = msg.replace(/\[size=([1-4][0-9]|5[0-9])]/gim,"<span style='font-size:$1px'>");
		msg = msg.replace(/\[\/size]/gim,"</span>");

		// FONT FACE
		msg = msg.replace(/\[font=(.*?)]/gim,"<span style='font-family:$1'>");
		msg = msg.replace(/\[\/font]/gim,"</span>");

		// PARAGRAPH ALIGNMENT
		msg = msg.replace(/\[p=(left|right|center|justify)\]/gim,"<p style='text-align:$1'>");
		msg = msg.replace(/\[\/p]/gim,'</p>');

		// TABLE
		while (msg.search(/\[table border=#([a-fA-F0-9]{1,6}){1,2}]/) !== -1) {
			let tableMSG = msg.substr(msg.search(/\[table border=#([a-fA-F0-9]{1,6}){1,2}]/), (msg.search(/\[\/table]/) !== -1 ? msg.search(/\[\/table]/) : msg.length));
			let color = tableMSG.match(/\[table border=#([a-fA-F0-9]{1,6}){1,2}]/)[1];
			// console.log(tableMSG.replace(/\[table border=#([a-fA-F0-9]{1,6}){1,2}]/gim, "<table><tbody>"));
			let rep = convertBBCode2HTML(tableMSG.replace(/\[table border=#([a-fA-F0-9]{1,6}){1,2}]/gim, "[table]"), color);
			msg = msg.replace(tableMSG, rep);
		}

		msg = msg.replace(/\[table align=right]/, "<table class='aligne-a-droite'><tbody>");
		msg = msg.replace(/\[table align=center]/, "<table class='aligne-au-centre'><tbody>");
		msg = msg.replace(/\[table align=left]/, "<table class='aligne-a-gauche'><tbody>");
		msg = msg.replace(/\[table]/gim,"<table><tbody>");
		msg = msg.replace(/\[\/table]/gim,"</tbody></table>");

		// ROW
		msg = msg.replace(/\[row]/gim,"<tr>");
		msg = msg.replace(/\[\/row]/gim,"</tr>");

		// CELL
		msg = msg.replace(/\[cel]/gim, tdColor === "" ? "<td>" : `<td style='border:1px solid #${tdColor}'>`);
		msg = msg.replace(/\[cel colspan=(\d+)]/gim, tdColor === "" ? "<td colspan='$1'>" : `<td colspan='$1' style='border:1px solid #${tdColor}'>`);
		msg = msg.replace(/\[cel rowspan=(\d+)]/gim, tdColor === "" ? "<td rowspan='$1'>" : `<td rowspan='$1' style='border:1px solid #${tdColor}'>`);
		msg = msg.replace(/\[cel colspan=(\d+) rowspan=(\d+)]/gim, tdColor === "" ? "<td colspan='$1' rowspan='$2'>" : `<td colspan='$1' rowspan='$2' style="border: 1px solid #${tdColor}">`);
		msg = msg.replace(/\[\/cel]/gim,"</td>");

		// IMAGE
		msg = msg.replace(/\[img](https?:\/\/.*?)\[\/img]/gim, '<img src="$1" alt="$1" class="inline-block img-ext" style="float:;">');
		msg = msg.replace(/\[img align=(left|right)](https?:\/\/.*?)\[\/img]/gim, '<img src="$2" alt="$2" class="inline-block img-ext" style="float:$1;">');

		// QUOTES
		msg = msg.replace(/\[quote]/gim, '<blockquote class="cadre cadre-quote"><small>said:</small><div>');
		msg = msg.replace(/\[quote=(.*?)]/gim, '<blockquote class="cadre cadre-quote"><small>$1 said:</small><div>');
		msg = msg.replace(/\[\/quote]/gim, '</div></blockquote>');

		// LINK
		msg = msg.replace(/\[url=(https?:\/\/.*?)](.*?)\[\/url]/gim, '<a href="$1" target="_blank" rel="noopener" onclick="return verifierLienMemePageMessage(event);">$2</a>');

		// LIST
		msg = msg.replace(/\[list]/gim, '<ul>');
		msg = msg.replace(/\[\/list]/gim, '</ul>');
		msg = msg.replace(/\[\*]/gim, '<li>');
		msg = msg.replace(/\[\/\*]/gim, '</li>');

		// VIDEO
		msg = msg.replace(/\[video](https?:\/\/.*?)\[\/video]/gim, '<iframe class="vid-ext" src="$1" allowfullscreen=""></iframe>');

		// SPOILER
		while (msg.search(/\[spoiler](.*?)\[\/spoiler]/) !== -1) {
			let id = Math.floor(Math.random() * 10000000) + 1;
			msg = msg.replace(/\[spoiler](.*?)\[\/spoiler]/, `<div class="cadre cadre-spoil"><button id="bouton_spoil_${id}" class="btn btn-small btn-message" onclick="afficherSpoiler('${id}');return false;">Spoiler</button><div id="div_spoil_${id}" class="hidden">$1</div></div>`)
		}

		while (msg.search(/\[spoiler=(.*?)](.*?)\[\/spoiler]/) !== -1) {
			let id = Math.floor(Math.random() * 10000000) + 1;
			msg = msg.replace(/\[spoiler=(.*?)](.*?)\[\/spoiler]/, `<div class="cadre cadre-spoil"><button id="bouton_spoil_${id}" class="btn btn-small btn-message" onclick="afficherSpoiler('${id}');return false;">Spoiler</button><span class="titre-spoiler" id="titre_spoil_${id}">$1</span><div id="div_spoil_${id}" class="hidden">$2</div></div>`)
		}

		// TABS
		let tabsPattern = /\[#(.*?)](.*?)\[\/#(.*?)]/g,
		    match;
		while ((match = tabsPattern.exec(msg)) !== null) {
			let tab_title = match[1],
			    id = !(flags.includes(tab_title.toLowerCase())) ? (Math.floor(Math.random() * 10000000) + 1).toString() : tab_title.toLowerCase();
			tabs.push({"title": tab_title, "id": id, "content": match[2]});
			msg = msg.replace(new RegExp(`\[#${match[1]}]${match[2]}\[\/#${match[3]}]`), "");
		}
		if (tabs.length === 1)
			msg = msg.replace(tabs[0].content, tabs[0].content);
		else if (tabs.length !== 0) {
			let new_msg = "<ul class='nav nav-tabs' id='tabsPREV'>";
			for (let index=0; index < tabs.length; index++) {
				let celass = '';
				if (index === 0)
					celass = 'class="active"';
				let title = flags.includes(tabs[index].title.toLowerCase()) ? `<img src="https://atelier801.com/img/pays/${tabs[index].title.toLowerCase()}.png" class="img16">` : tabs[index].title;
				new_msg += `<li id="li_tab${tabs[index].id}" ${celass}><a href="#tab${tabs[index].id}" id="lien_tab${tabs[index].id}" data-toggle="tab">${title}</a></li>`;
			}
			new_msg += '</ul><div class="tab-content">';
			for (let index=0; index < tabs.length; index++)
				new_msg += `<div id="tab${tabs[index].id}" class="tab-pane${index === 0 ? ' active' : ''}">${tabs[index].content}</div>`;
			new_msg += '</div>';
			new_msg += `<script type="text/javascript">jQuery('#tabsPREV a').click(function (event) {(event.preventDefault) ? event.preventDefault() : event.returnValue = false;jQuery(this).tab('show');});</script>`;
			return new_msg;
		}
		return msg;
	}
})();
