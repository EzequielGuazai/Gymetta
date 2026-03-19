import type { WorkoutDay } from '@/types'

export const WORKOUT_DAYS: Record<string, WorkoutDay> = {
  a1: {
    key: 'a1',
    label: 'Segunda — Treino A1',
    shortLabel: 'A1',
    type: 'upper',
    intensity: 'heavy',
    exercises: [
      {
        id: 'a1_supino_inc_h', name: 'Supino inclinado com halteres',
        sets: 3, reps: '6–8', rest: '2 min', type: 'compound',
        muscle: 'Peito superior + Ombros', emoji: '🏋️',
        ytQuery: 'supino inclinado halteres como fazer correto',
        desc: 'Banco inclinado ~45°. Segura um halter em cada mão ao nível do peito, cotovelos levemente inclinados para dentro. Empurra para cima expirando e desce de forma controlada em 2–3 seg.',
      },
      {
        id: 'a1_barra_fixa', name: 'Barra fixa pegada pronada',
        sets: 3, reps: '6–8', rest: '2 min', type: 'compound',
        muscle: 'Dorsal + Bíceps', emoji: '🤸',
        ytQuery: 'barra fixa pegada pronada como fazer iniciantes',
        desc: 'Palmas viradas para fora, mãos afastadas além dos ombros. Puxa o corpo até o queixo passar a barra. Se não conseguires as reps, usa uma borracha de assistência ou substitui por Remada Curvada extra.',
      },
      {
        id: 'a1_desenv_barra', name: 'Desenvolvimento com barra',
        sets: 3, reps: '6–8', rest: '2 min', type: 'compound',
        muscle: 'Deltóides (ombros)', emoji: '⬆️',
        ytQuery: 'desenvolvimento ombros barra overhead press como fazer',
        desc: 'Em pé ou sentado, barra ao nível do peito com cotovelos à frente. Empurra acima da cabeça até os braços ficarem esticados. Não arqueies a lombar — mantém abdômen contraído.',
      },
      {
        id: 'a1_encol_barra', name: 'Encolhimento com barra',
        sets: 3, reps: '10–12', rest: '2 min', type: 'compound',
        muscle: 'Trapézio', emoji: '↕️',
        ytQuery: 'encolhimento barra trapezio shrug como fazer',
        desc: 'Em pé com barra segura à frente. Braços esticados. Encolhe os ombros para cima e segura 1 segundo no topo. Desce devagar. Não dobres os cotovelos — só os ombros se mexem.',
      },
      {
        id: 'a1_supino_barra', name: 'Supino reto com barra',
        sets: 3, reps: '6–8', rest: '2 min', type: 'compound',
        muscle: 'Peito + Tríceps + Ombros', emoji: '🏋️',
        ytQuery: 'supino reto barra como fazer correto forma',
        desc: 'Deitado no banco, barra com mãos um pouco mais largas que os ombros. Desce a barra controlada ao peito (toque suave) e empurra para cima com força. O exercício base para o peito.',
      },
      {
        id: 'a1_remada_curv', name: 'Remada curvada',
        sets: 3, reps: '6–8', rest: '2 min', type: 'compound',
        muscle: 'Dorsal + Trapézio + Rombóides', emoji: '↩️',
        ytQuery: 'remada curvada barra como fazer correto',
        desc: 'Inclina o tronco ~45°, barra nas mãos. Puxa em direção ao umbigo mantendo os cotovelos junto ao corpo. Costas retas em toda a amplitude. O exercício base para as costas.',
      },
      {
        id: 'a1_triceps_testa', name: 'Tríceps testa (skull crusher)',
        sets: 3, reps: '10–15', rest: '1 min', type: 'accessory',
        muscle: 'Tríceps', emoji: '💪',
        ytQuery: 'skull crusher triceps testa barra como fazer',
        desc: 'Deitado no banco, barra (ou halter) com braços esticados para cima. Dobra os cotovelos deixando a barra descer à testa. Cotovelos fixos apontados para o teto — só o antebraço mexe.',
      },
      {
        id: 'a1_rosca_direta', name: 'Rosca direta com barra',
        sets: 3, reps: '10–15', rest: '1 min', type: 'accessory',
        muscle: 'Bíceps', emoji: '💪',
        ytQuery: 'rosca direta barra como fazer bicep curl',
        desc: 'Em pé, barra com pegada supinada (palmas para cima). Cotovelos fixos junto ao corpo. Dobra os braços trazendo a barra aos ombros e desce devagar sem bater nos quadris.',
      },
    ],
  },
  b1: {
    key: 'b1',
    label: 'Terça — Treino B1',
    shortLabel: 'B1',
    type: 'lower',
    intensity: 'heavy',
    exercises: [
      {
        id: 'b1_agach_livre', name: 'Agachamento livre',
        sets: 4, reps: '6–8', rest: '2 min', type: 'compound',
        muscle: 'Quadríceps + Glúteos + Isquiotibiais', emoji: '🦵',
        ytQuery: 'agachamento livre barra como fazer iniciantes',
        desc: 'Barra nas costas (trapézio), pés à largura dos ombros ligeiramente virados para fora. Agacha até as coxas ficarem paralelas ao chão. Mantém o peito levantado, joelhos na direção dos pés. O rei dos exercícios.',
      },
      {
        id: 'b1_avanco', name: 'Avanço com halteres (lunges)',
        sets: 4, reps: '8–10 cada', rest: '2 min', type: 'compound',
        muscle: 'Quadríceps + Glúteos', emoji: '🦶',
        ytQuery: 'avanco lunge halteres como fazer correto',
        desc: 'Em pé com um halter em cada mão. Dá um passo largo à frente e dobra o joelho traseiro quase até ao chão. Empurra o calcanhar da frente para voltar. Alterna as pernas.',
      },
      {
        id: 'b1_leg_curl_h', name: 'Leg curl deitado com halter',
        sets: 3, reps: '10–15', rest: '1 min', type: 'accessory',
        muscle: 'Isquiotibiais (parte traseira da coxa)', emoji: '🦵',
        ytQuery: 'leg curl deitado halter entre os pes como fazer',
        desc: 'Deita de barriga para baixo num banco. Segura um halter entre os pés (engancha o tornozelo). Dobra os joelhos trazendo os calcanhares ao rabo. Desce devagar 3 seg.',
      },
      {
        id: 'b1_gemeos_pe', name: 'Elevação de gêmeos em pé',
        sets: 3, reps: '10–15', rest: '1 min', type: 'accessory',
        muscle: 'Gémeos (gastrocnémio)', emoji: '🦶',
        ytQuery: 'elevacao gemeos em pe halter degrau como fazer',
        desc: 'Em pé, calcanhar no bordo de um degrau/step, halter na mão. Sobe na ponta do pé ao máximo e desce além do nível para sentir o alongamento. Para mais intensidade faz um pé de cada vez.',
      },
      {
        id: 'b1_gemeos_sent', name: 'Elevação de gêmeos sentado',
        sets: 3, reps: '10–15', rest: '1 min', type: 'accessory',
        muscle: 'Gémeos (sóleo)', emoji: '🦶',
        ytQuery: 'elevacao gemeos sentado halter joelhos como fazer',
        desc: 'Sentado num banco, joelhos dobrados a 90°, halteres nos joelhos. Sobe na ponta dos pés e desce devagar. Foca no sóleo, diferente da versão em pé.',
      },
    ],
  },
  a2: {
    key: 'a2',
    label: 'Quinta — Treino A2',
    shortLabel: 'A2',
    type: 'upper',
    intensity: 'volume',
    exercises: [
      {
        id: 'a2_supino_h', name: 'Supino reto com halteres',
        sets: 3, reps: '10–12', rest: '2 min', type: 'compound',
        muscle: 'Peito + Tríceps', emoji: '🏋️',
        ytQuery: 'supino reto halteres como fazer dumbbell bench press',
        desc: 'Banco reto com halteres. Maior amplitude que a barra — desce até sentir o alongamento no peito. Excelente para trabalhar cada lado de forma independente.',
      },
      {
        id: 'a2_remada_sup', name: 'Remada pegada supinada',
        sets: 3, reps: '10–12', rest: '2 min', type: 'compound',
        muscle: 'Dorsal inferior + Bíceps', emoji: '↩️',
        ytQuery: 'remada curvada pegada supinada underhand row como fazer',
        desc: 'Igual à remada curvada mas palmas viradas para CIMA (pegada underhand). Ativa mais o bíceps e a parte inferior do dorsal. Puxa ao umbigo com cotovelos junto ao corpo.',
      },
      {
        id: 'a2_desenv_h', name: 'Desenvolvimento com halteres',
        sets: 3, reps: '10–12', rest: '2 min', type: 'compound',
        muscle: 'Deltóides', emoji: '⬆️',
        ytQuery: 'desenvolvimento ombros halteres dumbbell shoulder press como fazer',
        desc: 'Sentado com um halter em cada mão ao nível dos ombros. Empurra para cima até os braços ficarem esticados. Maior amplitude que com barra, ótimo para simetria dos ombros.',
      },
      {
        id: 'a2_remada_uni', name: 'Remada unilateral (cavalinho)',
        sets: 3, reps: '10–12', rest: '2 min', type: 'compound',
        muscle: 'Dorsal + Rombóides + Bíceps', emoji: '↩️',
        ytQuery: 'remada unilateral cavalinho halter como fazer one arm row',
        desc: 'Apoia um joelho e mão do mesmo lado num banco. Halter na outra mão, braço esticado. Puxa o halter para o quadril como a arrancar um motor. Costas retas e paralelas ao chão.',
      },
      {
        id: 'a2_supino_inc_b', name: 'Supino inclinado com barra',
        sets: 3, reps: '10–12', rest: '2 min', type: 'compound',
        muscle: 'Peito superior + Ombros', emoji: '🏋️',
        ytQuery: 'supino inclinado barra como fazer incline barbell press',
        desc: 'Banco inclinado com a barra. Mais estável que os halteres para cargas maiores. Desce de forma controlada ao peito superior e empurra para cima. Essencial para o peito superior.',
      },
      {
        id: 'a2_encol_h', name: 'Encolhimento com halteres',
        sets: 3, reps: '10–12', rest: '2 min', type: 'compound',
        muscle: 'Trapézio', emoji: '↕️',
        ytQuery: 'encolhimento halteres trapezio dumbbell shrug como fazer',
        desc: 'Em pé com halteres pendurados ao lado. Encolhe os ombros para cima e segura 1 seg no topo. Maior amplitude de movimento que com barra.',
      },
      {
        id: 'a2_rosca_fran', name: 'Rosca francesa com halter',
        sets: 3, reps: '10–15', rest: '1 min', type: 'accessory',
        muscle: 'Tríceps', emoji: '💪',
        ytQuery: 'rosca francesa halter overhead tricep extension como fazer',
        desc: 'Sentado ou deitado, segura um halter com as duas mãos acima da cabeça, braços esticados. Dobra os cotovelos deixando o halter descer atrás da cabeça e volta. Cotovelos fixos e apontados para o teto.',
      },
      {
        id: 'a2_rosca_alt', name: 'Rosca alternada com halteres',
        sets: 3, reps: '10–15', rest: '1 min', type: 'accessory',
        muscle: 'Bíceps', emoji: '💪',
        ytQuery: 'rosca alternada halteres como fazer bicep curl alternado',
        desc: 'Em pé com um halter em cada mão. Dobra um braço de cada vez em direção ao ombro, alternando. Roda o pulso ao subir (supinação) para maior ativação do bíceps.',
      },
    ],
  },
  b2: {
    key: 'b2',
    label: 'Sexta — Treino B2',
    shortLabel: 'B2',
    type: 'lower',
    intensity: 'volume',
    exercises: [
      {
        id: 'b2_goblet', name: 'Agachamento goblet com halter',
        sets: 4, reps: '10–12', rest: '2 min', type: 'compound',
        muscle: 'Quadríceps + Glúteos + Core', emoji: '🦵',
        ytQuery: 'agachamento goblet halter como fazer goblet squat',
        desc: 'Em pé, segura um halter na vertical com as duas mãos ao nível do peito (como um cálice). Agacha até as coxas paralelas ao chão. Excelente para a técnica e para os quadríceps.',
      },
      {
        id: 'b2_stiff', name: 'Stiff (peso morto romeno)',
        sets: 4, reps: '6–8', rest: '2 min', type: 'compound',
        muscle: 'Isquiotibiais + Glúteos + Lombar', emoji: '🏋️',
        ytQuery: 'stiff peso morto romeno barra como fazer RDL',
        desc: 'Em pé com barra na frente das coxas. Pernas quase esticadas. Inclina o tronco para a frente deslizando a barra pelas pernas até sentir o alongamento nos isquiotibiais. COSTAS SEMPRE RETAS.',
      },
      {
        id: 'b2_leg_curl_h', name: 'Leg curl deitado com halter',
        sets: 3, reps: '10–15', rest: '1 min', type: 'accessory',
        muscle: 'Isquiotibiais', emoji: '🦵',
        ytQuery: 'leg curl deitado halter isquiotibial como fazer',
        desc: 'Deitado de barriga para baixo, halter entre os pés. Dobra os joelhos trazendo os calcanhares ao rabo e desce devagar.',
      },
      {
        id: 'b2_gemeos_sent', name: 'Elevação de gêmeos sentado',
        sets: 3, reps: '15–20', rest: '1 min', type: 'accessory',
        muscle: 'Sóleo', emoji: '🦶',
        ytQuery: 'elevacao gemeos sentado halter seated calf raise',
        desc: 'Sentado com halteres nos joelhos. Sobe na ponta dos pés e desce devagar. 15–20 reps, sente a queimação.',
      },
      {
        id: 'b2_gemeos_pe', name: 'Elevação de gêmeos em pé',
        sets: 3, reps: '15–20', rest: '1 min', type: 'accessory',
        muscle: 'Gastrocnémio', emoji: '🦶',
        ytQuery: 'elevacao gemeos em pe halter calf raise standing',
        desc: 'Em pé, halter na mão, calcanhar no bordo de um degrau. Sobe na ponta do pé e desce além do nível para sentir o alongamento.',
      },
    ],
  },
}

export const WEEK_SCHEDULE: Record<string, string | null> = {
  seg: 'a1', ter: 'b1', qua: null, qui: 'a2', sex: 'b2', sab: null, dom: null,
}

export const DAY_LABELS: Record<string, string> = {
  seg: 'Seg', ter: 'Ter', qua: 'Qua', qui: 'Qui', sex: 'Sex', sab: 'Sáb', dom: 'Dom',
}

export const JS_DAY_TO_KEY: Record<number, string> = {
  0: 'dom', 1: 'seg', 2: 'ter', 3: 'qua', 4: 'qui', 5: 'sex', 6: 'sab',
}

export const ALL_EXERCISES = Object.values(WORKOUT_DAYS).flatMap(d => d.exercises)

export function getExerciseById(id: string) {
  return ALL_EXERCISES.find(e => e.id === id)
}
