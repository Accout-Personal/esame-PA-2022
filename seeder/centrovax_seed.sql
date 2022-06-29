USE centrovax;
--
-- Dump dei dati per la tabella `centro_vaccinale`
--
INSERT INTO `centro_vaccinale` (`id`, `nome`, `lati`, `longi`, `maxf1`, `maxf2`) VALUES
(1, 'blocco sud', 43.585275, 13.514147, 10, 10),
(2, 'ugo bassi', 43.603466, 13.507289, 4, 6),
(3, 'Dip. Ingengneria', 43.586838, 13.516867, 16, 16),
(4, 'Cimitero Tavernelle', 43.589946, 13.518576, 8, 8),
(5, 'Piazza Cavour', 43.616886, 13.516915, 6, 12),
(6, 'Varano', 43.569086, 13.546493, 8, 8),
(7, 'McDonald', 43.558163, 13.510551, 16, 16),
(8, 'Burger King', 43.550007, 13.511048, 16, 16),
(9, 'Torrette', 43.614551, 13.431032, 8, 8),
(10, 'Stadio Dorico', 43.616847, 13.529931, 16, 16),
(11, 'Stadio Dorico 2', 43.61658, 13.529906, 16, 16);

--
-- Dump dei dati per la tabella `users`
--

INSERT INTO `users` (`id`, `cf`, `username`, `password`, `tipo`) VALUES
(1, 'DYTDZW30L41E573J', 'admin1', 'adminadmin', 1),
(2, 'LCCSFJ32S42E985X', 'admin2', 'admin2admin2', 1),
(3, 'FMZVQI10A47Z337B', 'user1', 'password', 0),
(4, 'MMMJHP38H05G556R', 'user2', 'password', 0),
(5, 'LNDXWB61D03A921T', 'user3', 'password', 0),
(6, 'JXBMLL49L06G931I', 'user4', 'password', 0),
(7, 'BRSZNM10M01H450W', 'user5', 'password', 0);

--
-- Dump dei dati per la tabella `vaccino`
--

INSERT INTO `vaccino` (`id`, `nome`, `validita`) VALUES
(1, 'Pfizer', 180),
(2, 'Astrazeneca', 130),
(4, 'Moderna', 120),
(5, 'Covovax', 150);

--
-- Dump dei dati per la tabella `prenotazione`
--

INSERT INTO `prenotazione` (`id`, `data`, `fascia`, `slot`, `centro_vac`, `vaccino`, `user`, `stato`) VALUES
(1, '2022-06-30', 1, 4, 1, 2, 3, 0),
(2, '2022-06-30', 1, 5, 1, 4, 4, 0),
(3, '2022-07-01', 2, 10, 3, 5, 3, 0),
(4, '2022-07-04', 2, 15, 8, 5, 5, 1),
(5, '2022-07-06', 1, 14, 8, 1, 6, 0);



