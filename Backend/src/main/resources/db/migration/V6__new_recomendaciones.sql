INSERT INTO tipo_recomendacion (
    nombre,
    mensaje,
    score_minimo,
    score_maximo,
    icono
)
VALUES
(
    'Situación crítica',
    'Tu situación financiera requiere atención inmediata. Prioriza cubrir gastos esenciales y evita nuevas deudas.',
    0,
    199,
    '🚨'
),
(
    'Estabiliza tus finanzas',
    'Tu margen es ajustado. Controla tus gastos, evita deudas nuevas y empieza a construir un colchón de seguridad.',
    200,
    399,
    '⚠️'
),
(
    'Construye tu fondo de ahorro',
    'Tu situación es manejable. Es buen momento para crear un fondo de emergencia y reducir deudas pendientes.',
    400,
    599,
    '🛡️'
),
(
    'Buena salud financiera',
    'Tienes una base sólida. Mantén el control del gasto y empieza a plantearte objetivos de ahorro a medio plazo.',
    600,
    749,
    '💰'
),
(
    'Listo para crecer',
    'Tu situación es muy buena. Puedes empezar a explorar inversión y planificación financiera a más largo plazo.',
    750,
    899,
    '📈'
),
(
    'Excelente salud financiera',
    'Tu perfil financiero es excelente. Mantén tus hábitos y revisa periódicamente tu estrategia de ahorro e inversión.',
    900,
    1000,
    '🏆'
);