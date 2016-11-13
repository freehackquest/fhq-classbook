if(!window.fhq) window.fhq = {};
if(!window.fhq.ui) window.fhq.ui = {};

window.fhq.ui.loadClassbookItem = function(link, cbid){
	console.log("link:" + link);
	$.ajax({
		url: link + "?t=" + Date.now(),
		type: 'GET'
	}).done(function(response){
		var a = link.split(".");
		var type = a[a.length-1].toUpperCase();
		var html = "";
		if(type == "MD"){
			var converter = new showdown.Converter(),
			html = converter.makeHtml(response);
			console.log("Load md: todo convert to html");
		}else{
			// html
			html = response;
		}
		if(cbid != undefined){
			fhq.changeLocationState({'cbid': cbid});
		}
		$('.fhqrightinfo').html(html);
	}).fail(function(){
		$('.fhqrightinfo').html("Not found");
	})
}

window.fhq.ui.loadClassbookSubmenu = function(submenu){
	fhq.ui.classbook_numbers.push(0);
	var len = submenu.length;
	for(var i = 0; i < len; i++){
		var o = submenu[i];
		var numbers_len = fhq.ui.classbook_numbers.length;
		fhq.ui.classbook_numbers[numbers_len-1] = fhq.ui.classbook_numbers[numbers_len-1] + 1;
		var num = fhq.ui.classbook_numbers.join('.');

		if(o.id)
			fhq.classbookCache[o.id] = o;

		if(o.link && o.name){
			$('.fhqleftlist .classbook .content').append('<div class="fhqleftitem" link="' + o.link + '" cbid="' + o.id + '" ><div class="name">' + num + ' ' + o.name + '</div></div>');	
		}else if(o.name){
			$('.fhqleftlist .classbook .content').append('<div class="fhqleftitem"><div class="name">' + num + ' ' + o.name + '</div></div>');	
		}
		
		if(o.submenu != undefined){
			fhq.ui.loadClassbookSubmenu(o.submenu);
		}
	}
	fhq.ui.classbook_numbers.pop();
}

window.fhq.ui.classbookSearchLinkByID = function(cbid){
	if(fhq.classbookCache[cbid]){
		return fhq.classbookCache[cbid].link;
	}
}

window.fhq.classbookCache = {};

window.fhq.ui.loadClassbook = function(){
	$('#content_page').html('<div class="fhqrightinfo"></div><div class="fhqleftlist"></div>');
	$('.fhqleftlist').html('');
	$('.fhqleftlist').append('<div class="classbook"><div class="icon">Учебник</div><div class="content"></div></div>');

	function applyDark(){
		$("body").addClass('dark');
		$('#btnmenu_colorscheme img').attr({'src': 'http://freehackquest.com/images/menu/lightside_150x150.png'});
		$('#btnmenu_colorscheme_text').html(fhq.t('Light'));
		localStorage.setItem('colorscheme', 'dark');
	}
	
	function applyLight(){
		$("body").removeClass('dark');
		$('#btnmenu_colorscheme img').attr({'src': 'http://freehackquest.com/images/menu/darkside_150x150.png'});
		$('#btnmenu_colorscheme_text').html(fhq.t('Dark'));
		localStorage.setItem('colorscheme', 'light');
	}

	$('#btnmenu_colorscheme').unbind().bind('click', function(e){
		if($("body").hasClass("dark")){
			applyLight();
		}else{
			applyDark();
		}
	});
	
	if(localStorage.getItem('colorscheme') == 'dark'){
		applyDark();
	}else{
		applyLight();
	}
	
	fhq.ui.classbook_numbers = [];
	fhq.classbookCache = {}
	fhq.ui.loadClassbookSubmenu(fhq.classbook);

	$('.fhqleftitem').unbind('click').bind('click', function(){
		var link = $(this).attr('link');
		var cbid = $(this).attr('cbid');
		fhq.ui.loadClassbookItem(link, cbid);
	});
	if(fhq.containsPageParam("cbid")){
		var cbid = fhq.pageParams["cbid"];
		console.log("cbid = " + cbid);
		var link = fhq.ui.classbookSearchLinkByID(cbid);
		fhq.ui.loadClassbookItem(link, cbid);
	}
	
	
}


$(document).ready(function(){
	
	var content_menu = "Содержание";
	var numbers = [];
	
	$('#btnmenu_archive').append(fhq.t('Archive'));
	$('#btnmenu_tools').append(fhq.t('Tools'));
	$('#btnmenu_classbook').append(fhq.t('Classbook'));
	
	fhq.ui.loadClassbook();
})


window.fhq.classbook = [
	{
		'id': 'trivia',
		'name' : 'Глава 01. Trivia',
		'link' : 'chapter01/chapter01.md',
		'submenu' : [
			{
				'id': 'trivia_base64',
				'name' : 'Base64',
				'link' : 'chapter01/base64.md'
			}, {
				'id': 'trivia_hex',
				'name' : 'Hex',
				'link' : 'chapter01/hex.md'
			}
		]
	}, {
		'id': 'linux',
		'name' : 'Глава 02. Linux',
		'link' : 'chapter02/chapter02.md',
		'submenu' : [
			{
				'id': 'linux_structure',
				'name' : 'Структура каталогов',
				'link' : 'chapter02/structure.md'
			},{
				'id': 'linux_tar',
				'name' : 'Архиватор tar',
				'link' : 'chapter02/tar.md'
			}
		]
	}, {
		'name' : 'Информатика',
		'submenu' : [
			{
				'name' : 'Введение и кратко об операционных системах',
				'link' : 'about_operation_system.html'
			}, {
				'name' : 'Хранение и кодирование информации',
				'link' : 'about_store_and_coding_information.html'
			}, {
				'name' : 'Векторное изображение',
				'link' : 'about_vector_image.html'
			}, {
				'name' : 'Растровое изображение',
				'link' : 'about_rast_image.html'
			}, {
				'name' : 'Звуковая информация',
				'link' : 'about_binary_sound.html'
			}, {
				
			}, {
				'name' : 'Бинарные операции, конвертирование из/в 2,10,16чные системы счисления',
				'link' : 'about_binary_operations.html'
			}, {
				'name' : 'Хэш-функции',
				'link' : 'about_hash_functions.html'
			}, {
				'name' : 'Криптографические алгоритмы',
				'link' : 'about_crypto_algorithms.html'
			}, {
				'name' : 'Виртуализация',
				'link': 'virtualization.html',
				'submenu' : [ {
						'name' : 'Гипервизор',
						'link' : 'virtualization_hypervisor.html'
					}, {
						'name' : 'Для чего нужна виртуализация?',
						'link' : 'virtualization_why.html'
					}, {
						'name' : 'Виды виртуализации',
						'link' : 'virtualization_types.html'
					}
				]
			}
		]
	}, {
		'name' : 'Aрхитектура колец защиты операционной системы',
		'link': 'architech_defence_os.html',
		'submenu' : [ {
			'name' : 'Режим супервизора',
			'link' : 'architech_defence_os_supervisor.html'
		}, {
			'name' : 'Режим гипервизора',
			'link' : 'architech_defence_os_hypervisor.html'
		} ]
	}, {
		'name' : 'Сети',
		'link' : 'network.html',
		'submenu' : [
			{
				'name' : 'OSI и основы',
				'link' : 'network_osi.html'
			}, {
				'name' : 'Коммутация и ЛВС',
				'link' : 'network_commutation.html'
			}, {
				'name' : 'Маршрутизация и глобальные сети',
				'link' : 'network_routing.html'
			}, {
				'name' : 'Беспроводные технологии',
				'link' : 'network_wireless.html'
			}, {
				'name' : 'Основные сервисы',
				'link' : 'network_base_services.html',
				'submenu' : [
					{
						'name': 'Что такое DHCP?',
						'link' : 'network_dhcp_what.html'
					} , {
						'name': 'Как работает DHCP?',
						'link' : 'network_dhcp_how.html'
					}
				]
			}, {
				'name' : 'Сетевые утилиты',
				'link' : 'network_tools.html',
				'submenu': [
					{
						'name': 'Сканирование (nmap)',
						'link' : 'network_tools_nmap.html'
					}
				]
			}
		]
	}, {
		'name' : 'Разработка программных средств (программирование)',
		'submenu' : [
			{
				'name' : 'Инструментарий разработчика',
				'submenu': [
					{
						'name' : 'Система контроля версий git',
						'link' : 'programming_tools_git.html'
					}
				]
			} , {
				'name': 'Основы программирования функции и объекты-классы (или ООП)',
				'link' : 'programming_oop.html'
			} , {
				'name' : 'Assembler',
				'link': 'programming_assambler.html',
				'submenu' : [
					{
						'name': 'Кратко об устройстве процессора',
						'link' : 'programming_assambler_proc.html'
					}, {
						'name' : 'Списки комманд и примеры',
						'link' : 'programming_assambler_commands.html'
					}, {
						'name' : 'Заключение по ассемблеру',
						'link' : 'programming_assambler_ps.html'
					}
				]
			},{
				'name' : 'C++',
				'link' : 'programming_cpp.html'
			},{
				'name' : 'Python',
				'link' : 'programming_python.html'
			},{
				'name' : 'JavaScript',
				'link' : 'programming_javascript.html'
			}
		]
	}, {
		'name' : 'Unix (Основы и философия)',
		'submenu' : [
			{
				'name': 'Философия UNIX',
				'link' : 'unix_philosophi.html'
			}, {
				'name' : 'Правила Community',
				'link' : 'unix_community_rules.html'
			}, {
				'name' : 'Почему CLI лучше GUI?',
				'link' : 'unix_why_cli_best_then_gui.html'
			}, {
				'name' : 'Конвееры и потоки',
				'link' : 'unix_conveers_and_thread.html'
			}, {
				'name' : 'Фильтры и другие полезные утилиты',
				'link' : 'unix_filters_and_usefull_utilites.html'
			}
		]
	}, {
		'name' : 'Linux',
		'submenu' : [
			{
				'name' : 'Просто полезные команды',
				'link' : 'linux_usefull_console_commands.html'
			}
		]
	}, {
		'name' : 'Команды для работы с VirtualBox из консоли',
		'link' : 'virtualbox.html'
	}, {
		'name' : 'Shell-программирование',
		'link': 'shell_programming.html',
		'submenu' : [
			{
				'name': 'Основы',
				'link': 'shell_programming_bases.html'
			}
		]
	}, {
		'name' : 'Базы данных',
		'link': 'databases.html',
		'submenu' : [
			{
				'name': 'Определения',
				'link': 'databases_definitions.html'
			}
		]
	}, {
		'name' : 'Правовая часть',
		'link' : 'legal_part.html'
	}, {
		'name' : 'Что можно почитать дополнительно',
		'submenu' : [
			{
				'name': 'Криптография',
				'link': 'forread_crypto.html'
			}, {
				'name': 'Сети',
				'link': 'forread_network.html'
			}, {
				'name': 'Программирование',
				'link': 'forread_programming.html'
			}, {
				'name': 'Администрирование Unix, Linux, BSD',
				'link': 'forread_admin_linux_unix_bsd.html'
			}, {
				'name': 'Взлом',
				'link': 'forread_hacking.html'
			}
		]
	}, {
		'name' : 'Анонимность в сети Интернет',
		'link': 'anonimus.html',
		'submenu' : [
			{
				'name': 'Прокси-сервер',
				'link': 'anonimus_proxy.html'
			}, {
				'name': 'VPN подключение',
				'link': 'anonimus_vpn.html'
			}, {
				'name': 'Выделенный сервер',
				'link' : 'anonimus_vps.html'
			}, {
				'name': 'TOR',
				'link' : 'anonimus_tor.html'
			}, {
				'name': 'I2P',
				'link' : 'anonimus_i2p.html'
			}
		]
	}, {
		'name' : 'Список источников',
		'link' : 'list_of_sources.html'
	}
];
