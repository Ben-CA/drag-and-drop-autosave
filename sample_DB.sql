-- Sample AutoSave Drag & Drop MySQL Database Structure
-- First, create database named "tracking", then import the following SQL:

-- Table structure for table `projects`
CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `project` varchar(90) NOT NULL,
  `project_order` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Sample data for table `projects`
INSERT INTO `projects` (`id`, `project`, `project_order`) VALUES
(1, 'TestA - Person 1 - January 1', 1),
(2, 'TestB - Person 1 - January 1', 2),
(3, 'TestC - Person 1 - January 1', 3),
(4, 'TestD - Person 1 - January 1', 4);

-- Indexes for table `projects`
ALTER TABLE `projects` ADD PRIMARY KEY (`id`);

-- AUTO_INCREMENT for table `projects`
ALTER TABLE `projects` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
