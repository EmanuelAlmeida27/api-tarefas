-- INSERT DE USUÁRIOS

INSERT INTO public.usuarios (nome, email, senha)
VALUES
  ('Usuário Teste', 'usuario.teste@example.com', '$2b$10$JjrZ8syha0YM/sNav25hVuyfW1rf5JnHWJFXCZ9j5ZnoFS.WMG8fW'),
  ('Bruno Oliveira', 'bruno.oliveira@example.com', '$2b$10$lrKZxcdTM4z4TR4OfT39Fe4P6s0Ky9tvT8dGbBb2FCENEH6dCdS3a'),
  ('Carla Santos', 'carla.santos@example.com', '$2b$10$I1m1OQ74mtJoUv4rOud/leQ.zx.rmki8gKPNf/ihvCGidazxAdOUO'),
  ('Diego Ferreira', 'diego.ferreira@example.com', '$2b$10$sSiTFTup6.aIgoxXUIab3OcsSs0CEibfMZK.2zXiTBB2VDF3gBij2'),
  ('Eduarda Lima', 'eduarda.lima@example.com', '$2b$10$HFW7OIcHXOwxsbzMR9hbcOCZXzLS8sZYAj0GHqwOvNDpK1Ums6CdS'),
  ('Felipe Costa', 'felipe.costa@example.com', '$2b$10$6B5daA1zOIusiOCPVsVjFODJLzEq.PpbYJyzvkNqtNjoTsxc1lkB6'),
  ('Gabriela Rocha', 'gabriela.rocha@example.com', '$2b$10$DVkMqRa5ywt6gZNxDL96FeUcTfIRGhPzkwPI44NiHl44ZCgceHJv2'),
  ('Henrique Souza', 'henrique.souza@example.com', '$2b$10$/.M24MBg2t.FnLnbKFu30ObX50XSCL1UxTWpU5X0zABtm5.WNk4Y.'),
  ('Isabela Martins', 'isabela.martins@example.com', '$2b$10$OE0JnGDK61ZzlQT5xEGEuec4x44dmOMJYkko1jGuji.nW/rx/wcZO'),
  ('João Pedro Alves', 'joao.alves@example.com', '$2b$10$SVg1ngr6VGTIFUg9ZcE8x.KNHHNpc2OdiP542g2W.TbZpYqMcc8b2');

-- ------------------------------------------------------------------------- --

-- INSERT DE TAREFAS

INSERT INTO public.tarefas
    (titulo, descricao, data_conclusao, concluida, id_usuario)
VALUES
    -- Usuário Teste
    ('Estudar SQL', 'Revisar SELECT, JOIN e GROUP BY', '2026-10-12', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'usuario.teste@example.com')),
    ('Organizar a semana', 'Definir prioridades e compromissos', '2026-10-11', TRUE,
        (SELECT id FROM public.usuarios WHERE email = 'usuario.teste@example.com')),
    ('Pagar conta de internet', 'Conferir o valor da fatura e efetuar o pagamento', '2026-10-15', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'usuario.teste@example.com')),
    ('Ler capítulo do livro', 'Ler o capítulo 4 e fazer anotações', '2026-10-18', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'usuario.teste@example.com')),
    ('Fazer backup', 'Salvar documentos importantes na nuvem', '2026-10-09', TRUE,
        (SELECT id FROM public.usuarios WHERE email = 'usuario.teste@example.com')),

    -- Bruno Oliveira
    ('Estudar JavaScript', 'Praticar arrays, objetos e funções', '2026-10-13', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'bruno.oliveira@example.com')),
    ('Atualizar currículo', 'Revisar experiências e conhecimentos técnicos', '2026-10-16', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'bruno.oliveira@example.com')),
    ('Comprar materiais', 'Comprar caderno, canetas e marcadores', '2026-10-14', TRUE,
        (SELECT id FROM public.usuarios WHERE email = 'bruno.oliveira@example.com')),
    ('Preparar apresentação', 'Organizar os slides do trabalho em grupo', '2026-10-20', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'bruno.oliveira@example.com')),
    ('Limpar a mesa', 'Organizar o espaço de estudo', NULL, FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'bruno.oliveira@example.com')),

    -- Carla Santos
    ('Revisar matemática', 'Resolver exercícios de funções', '2026-10-12', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'carla.santos@example.com')),
    ('Marcar consulta', 'Verificar horários disponíveis', '2026-10-17', TRUE,
        (SELECT id FROM public.usuarios WHERE email = 'carla.santos@example.com')),
    ('Entregar relatório', 'Revisar o texto e enviar o documento', '2026-10-14', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'carla.santos@example.com')),
    ('Organizar fotos', 'Separar fotos por ano e evento', NULL, FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'carla.santos@example.com')),
    ('Estudar inglês', 'Praticar vocabulário por 30 minutos', '2026-10-19', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'carla.santos@example.com')),

    -- Diego Ferreira
    ('Implementar login', 'Validar credenciais e gerar token JWT', '2026-10-13', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'diego.ferreira@example.com')),
    ('Revisar código', 'Verificar erros e melhorar nomes de variáveis', '2026-10-11', TRUE,
        (SELECT id FROM public.usuarios WHERE email = 'diego.ferreira@example.com')),
    ('Estudar PostgreSQL', 'Praticar chaves estrangeiras e consultas', '2026-10-16', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'diego.ferreira@example.com')),
    ('Enviar atividade', 'Conferir os arquivos antes do envio', '2026-10-10', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'diego.ferreira@example.com')),
    ('Planejar projeto', 'Definir as etapas da próxima entrega', NULL, FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'diego.ferreira@example.com')),

    -- Eduarda Lima
    ('Fazer compras', 'Comprar alimentos para a semana', '2026-10-11', TRUE,
        (SELECT id FROM public.usuarios WHERE email = 'eduarda.lima@example.com')),
    ('Estudar estrutura de dados', 'Revisar listas, filas e pilhas', '2026-10-15', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'eduarda.lima@example.com')),
    ('Preparar almoço', 'Separar os ingredientes e organizar a cozinha', NULL, FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'eduarda.lima@example.com')),
    ('Finalizar trabalho', 'Revisar o conteúdo e formatar o documento', '2026-10-18', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'eduarda.lima@example.com')),
    ('Renovar documento', 'Verificar os requisitos para renovação', '2026-10-21', TRUE,
        (SELECT id FROM public.usuarios WHERE email = 'eduarda.lima@example.com')),

    -- Felipe Costa
    ('Criar testes da API', 'Testar cadastro, login e operações de tarefas', '2026-10-14', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'felipe.costa@example.com')),
    ('Organizar arquivos', 'Separar documentos pessoais e acadêmicos', NULL, TRUE,
        (SELECT id FROM public.usuarios WHERE email = 'felipe.costa@example.com')),
    ('Estudar redes', 'Revisar os conceitos de TCP e HTTP', '2026-10-17', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'felipe.costa@example.com')),
    ('Responder mensagens', 'Retornar mensagens pendentes', '2026-10-10', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'felipe.costa@example.com')),
    ('Atualizar dependências', 'Verificar versões e possíveis incompatibilidades', '2026-10-22', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'felipe.costa@example.com')),

    -- Gabriela Rocha
    ('Revisar conteúdo da prova', 'Estudar os resumos das últimas aulas', '2026-10-12', TRUE,
        (SELECT id FROM public.usuarios WHERE email = 'gabriela.rocha@example.com')),
    ('Montar portfólio', 'Selecionar projetos para publicar no GitHub', '2026-10-20', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'gabriela.rocha@example.com')),
    ('Agendar reunião', 'Combinar horário com os integrantes do grupo', '2026-10-13', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'gabriela.rocha@example.com')),
    ('Fazer caminhada', 'Caminhar no parque por 30 minutos', NULL, TRUE,
        (SELECT id FROM public.usuarios WHERE email = 'gabriela.rocha@example.com')),
    ('Entregar exercícios', 'Conferir todas as respostas antes de enviar', '2026-10-16', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'gabriela.rocha@example.com')),

    -- Henrique Souza
    ('Estudar orientação a objetos', 'Revisar classes, herança e polimorfismo', '2026-10-15', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'henrique.souza@example.com')),
    ('Corrigir erros do projeto', 'Investigar falhas encontradas durante os testes', '2026-10-12', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'henrique.souza@example.com')),
    ('Pagar mensalidade', 'Conferir o vencimento e guardar o comprovante', '2026-10-10', TRUE,
        (SELECT id FROM public.usuarios WHERE email = 'henrique.souza@example.com')),
    ('Planejar estudos', 'Distribuir as matérias ao longo da semana', NULL, FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'henrique.souza@example.com')),
    ('Pesquisar estágio', 'Buscar oportunidades para estudantes de TI', '2026-10-19', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'henrique.souza@example.com')),

    -- Isabela Martins
    ('Estudar modelagem de dados', 'Praticar relacionamentos entre tabelas', '2026-10-14', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'isabela.martins@example.com')),
    ('Fazer backup do projeto', 'Salvar o código e conferir o repositório remoto', '2026-10-11', TRUE,
        (SELECT id FROM public.usuarios WHERE email = 'isabela.martins@example.com')),
    ('Preparar prova', 'Revisar anotações e exercícios anteriores', '2026-10-18', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'isabela.martins@example.com')),
    ('Organizar agenda', 'Atualizar horários de aula e compromissos', NULL, FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'isabela.martins@example.com')),
    ('Enviar documentação', 'Conferir os documentos solicitados', '2026-10-16', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'isabela.martins@example.com')),

    -- João Pedro Alves
    ('Implementar filtros', 'Permitir filtrar tarefas por status', '2026-10-17', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'joao.alves@example.com')),
    ('Revisar autenticação', 'Verificar acesso às tarefas por usuário', '2026-10-12', TRUE,
        (SELECT id FROM public.usuarios WHERE email = 'joao.alves@example.com')),
    ('Estudar React', 'Aprender componentes, props e estado', '2026-10-21', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'joao.alves@example.com')),
    ('Atualizar README', 'Documentar as rotas e exemplos de uso da API', NULL, FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'joao.alves@example.com')),
    ('Testar exclusão de tarefas', 'Verificar respostas para IDs inexistentes', '2026-10-15', FALSE,
        (SELECT id FROM public.usuarios WHERE email = 'joao.alves@example.com'));

-- ------------------------------------------------------------------------- --