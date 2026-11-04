/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/link
 */

/**
 * The endings a bare domain links with, besides those `link.typedLinkTlds`
 * adds: the generic ones of at least 1 in 1,000 of the sites in Tranco's top
 * million (list GQ38K, https://tranco-list.eu/list/GQ38K), then every
 * two-letter one in IANA's list (version 2026102900,
 * https://data.iana.org/TLD/tlds-alpha-by-domain.txt). Together they're the
 * endings of 96% of those sites
 * @private
 */
export const TLDS: Set<string> = new Set(
	`
	app biz casino click cloud club com dev edu gov info live net online org pro
	shop site space store tech top vip xyz
	ac ad ae af ag ai al am ao aq ar as at au aw ax az ba bb bd be bf bg bh bi
	bj bm bn bo br bs bt bv bw by bz ca cc cd cf cg ch ci ck cl cm cn co cr cu
	cv cw cx cy cz de dj dk dm do dz ec ee eg er es et eu fi fj fk fm fo fr ga
	gb gd ge gf gg gh gi gl gm gn gp gq gr gs gt gu gw gy hk hm hn hr ht hu id
	ie il im in io iq ir is it je jm jo jp ke kg kh ki km kn kp kr kw ky kz la
	lb lc li lk lr ls lt lu lv ly ma mc md me mg mh mk ml mm mn mo mp mq mr ms
	mt mu mv mw mx my mz na nc ne nf ng ni nl no np nr nu nz om pa pe pf pg ph
	pk pl pm pn pr ps pt pw py qa re ro rs ru rw sa sb sc sd se sg sh si sj sk
	sl sm sn so sr ss st su sv sx sy sz tc td tf tg th tj tk tl tm tn to tr tt
	tv tw tz ua ug uk us uy uz va vc ve vg vi vn vu wf ws ye yt za zm zw
`
		.trim()
		.split(/\s+/)
);
