
// Seadistuste tähised
katex.render("g:", document.getElementById("g_seadistus"));
katex.render("m:", document.getElementById("m_seadistus"));
katex.render("\\mu:", document.getElementById("mu_seadistus"));
katex.render("v_0:", document.getElementById("vi_seadistus"));
katex.render("\\alpha:", document.getElementById("angle_seadistus"));

// Reaalajas väärtuste tähised
katex.render("x:", document.getElementById("x_väärtus"));
katex.render("v:", document.getElementById("v_väärtus"));
katex.render("a:", document.getElementById("a_väärtus"));
katex.render("F_{res}:", document.getElementById("Fres_väärtus"));
katex.render("F_h:", document.getElementById("Fh_väärtus"));
katex.render("t:", document.getElementById("t_väärtus"));

// Valemid
katex.render("F_x = m \\cdot g \\cdot sin(\\alpha)", document.getElementById("Fx"));
katex.render("F_n = m\\cdot g\\cdot cos(\\alpha)", document.getElementById("Fn"));
katex.render("F_h = \\mu \\cdot F_n", document.getElementById("Fh"));
katex.render("F_{res} = F_x - F_h", document.getElementById("Fres"));
katex.render("a = \\frac {F_{res}}{m}", document.getElementById("a"));
katex.render("v = v_0 + a \\cdot t", document.getElementById("v"));
katex.render("x = v_0 \\cdot t + \\frac {a \\cdot t^2}{2}", document.getElementById("x"));
