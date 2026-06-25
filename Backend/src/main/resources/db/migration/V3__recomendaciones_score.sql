ALTER TABLE
    tipo_recomendacion
ADD
    COLUMN score_minimo INT NOT NULL DEFAULT 0;

ALTER TABLE
    tipo_recomendacion
ADD
    COLUMN score_maximo INT NOT NULL DEFAULT 100;

ALTER TABLE
    tipo_recomendacion
ADD
    COLUMN icono VARCHAR(10) DEFAULT NULL;

INSERT INTO
    tipo_recomendacion (
        nombre,
        mensaje,
        score_minimo,
        score_maximo,
        icono
    )
VALUES
    (
        'Situación crítica',
        'Tu situación financiera requiere atención urgente. Reduce todos los gastos no esenciales de inmediato.',
        0,
        20,
        '🚨'
    ),
    (
        'Gastos descontrolados',
        'Tus gastos superan tus ingresos. Crea un presupuesto estricto y elimina suscripciones innecesarias.',
        0,
        35,
        '📉'
    ),
    (
        'Fondo de emergencia',
        'No tienes colchón financiero. Prioriza ahorrar al menos 3 meses de gastos fijos antes de cualquier inversión.',
        0,
        50,
        '🛡️'
    ),
    (
        'Optimiza tus presupuestos',
        'Ajusta tus categorías de presupuesto. Pequeños recortes acumulados pueden mejorar tu score notablemente.',
        20,
        60,
        '⚖️'
    ),
    (
        'Reduce deudas',
        'Focaliza pagos en la deuda con mayor interés (método avalancha) para reducir el coste total.',
        20,
        55,
        '💳'
    ),
    (
        'Ahorro constante',
        'Establece una transferencia automática al ahorro el día de cobro. Incluso un 5% marca la diferencia.',
        30,
        70,
        '💰'
    ),
    (
        'Diversifica ingresos',
        'Considera fuentes de ingreso complementarias: freelance, dividendos o activos que generen renta pasiva.',
        50,
        80,
        '📊'
    ),
    (
        'Invierte tu excedente',
        'Tu situación es estable. Evalúa fondos indexados o depósitos a plazo para hacer crecer tu capital.',
        60,
        85,
        '📈'
    ),
    (
        'Optimiza fiscalmente',
        'Revisa deducciones fiscales disponibles. Un asesor puede ayudarte a reducir tu carga tributaria legalmente.',
        65,
        100,
        '🏛️'
    ),
    (
        'Perfil financiero óptimo',
        'Excelente gestión. Mantén tu disciplina y considera metas de largo plazo como jubilación anticipada.',
        80,
        100,
        '🏆'
    );