import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const splitSql = (sql: string) => {
  return sql.split(';').filter(content => content.trim() !== '')
}

async function main() {
  const sql = `

INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "emailVerified", "status", "globalRole", "password") VALUES ('ddbd64ef-d456-49e5-96f2-7f80c825ee1f', '10Jeremy.Gerhold@hotmail.com', 'William Davis', 'https://i.imgur.com/YfJQV5z.png?id=12', 'inv67890', false, 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "emailVerified", "status", "globalRole", "password") VALUES ('81f2ceb5-d569-451d-8c14-9e96ee543678', '19Loren_Stehr@gmail.com', 'John Doe', 'https://i.imgur.com/YfJQV5z.png?id=21', 'inv11223', false, 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "emailVerified", "status", "globalRole", "password") VALUES ('b9f9faaa-0fa5-4d9d-8650-2a1fd075625c', '28Meta8@yahoo.com', 'John Doe', 'https://i.imgur.com/YfJQV5z.png?id=30', 'inv67890', true, 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "emailVerified", "status", "globalRole", "password") VALUES ('5252e271-f145-4f60-8948-87182e6bfa4f', '37Annie_Erdman-Maggio@yahoo.com', 'William Davis', 'https://i.imgur.com/YfJQV5z.png?id=39', 'inv44556', true, 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "emailVerified", "status", "globalRole", "password") VALUES ('620be104-047d-4e01-a92f-440dfef53b09', '46Dayne1@gmail.com', 'Michael Brown', 'https://i.imgur.com/YfJQV5z.png?id=48', 'inv67890', false, 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "emailVerified", "status", "globalRole", "password") VALUES ('62bf5d41-b996-4980-8456-0e4bc243905f', '55Elva_Weber@gmail.com', 'Jane Smith', 'https://i.imgur.com/YfJQV5z.png?id=57', 'inv78901', true, 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "emailVerified", "status", "globalRole", "password") VALUES ('fc996695-26cf-4fba-a8f6-9658ef516b54', '64Marques_Mills39@yahoo.com', 'William Davis', 'https://i.imgur.com/YfJQV5z.png?id=66', 'inv44556', false, 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "emailVerified", "status", "globalRole", "password") VALUES ('19d48407-c429-4603-911a-8398aa1dba28', '73Abdiel_Mayer89@hotmail.com', 'Michael Brown', 'https://i.imgur.com/YfJQV5z.png?id=75', 'inv78901', false, 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');
INSERT INTO "User" ("id", "email", "name", "pictureUrl", "tokenInvitation", "emailVerified", "status", "globalRole", "password") VALUES ('33f0ca30-fd09-4c9e-97ca-eaec4eeb0b1d', '82Gordon_Hoppe@yahoo.com', 'Michael Brown', 'https://i.imgur.com/YfJQV5z.png?id=84', 'inv78901', false, 'VERIFIED', 'USER', '$2b$10$ppubsZypHzkqW9dkhMB97ul2.wSsvaCoDE2CzqIHygddRMKXvpYUC');

INSERT INTO "Meal" ("id", "name", "price", "photoUrl") VALUES ('29755f2b-2c5a-480c-906c-9ab920905ecb', 'Chicken Caesar Salad', '10.75', 'https://i.imgur.com/YfJQV5z.png?id=93');
INSERT INTO "Meal" ("id", "name", "price", "photoUrl") VALUES ('19fabef9-cb8b-43f8-b4f3-50fa7dae73c9', 'Chicken Caesar Salad', '15.00', 'https://i.imgur.com/YfJQV5z.png?id=97');
INSERT INTO "Meal" ("id", "name", "price", "photoUrl") VALUES ('73e7ec4a-4ed7-488d-993f-5a9a8d4229c2', 'Beef Tacos', '12.99', 'https://i.imgur.com/YfJQV5z.png?id=101');
INSERT INTO "Meal" ("id", "name", "price", "photoUrl") VALUES ('3acea5df-4b43-4c56-ba13-cf3b1561e556', 'Vegetarian Pizza', '9.00', 'https://i.imgur.com/YfJQV5z.png?id=105');
INSERT INTO "Meal" ("id", "name", "price", "photoUrl") VALUES ('c6b890c1-f613-450b-a7dd-4b53fd694d97', 'Grilled Salmon', '10.75', 'https://i.imgur.com/YfJQV5z.png?id=109');
INSERT INTO "Meal" ("id", "name", "price", "photoUrl") VALUES ('fa95ed83-5669-440e-a1b3-7777fabeedd1', 'Vegetarian Pizza', '9.00', 'https://i.imgur.com/YfJQV5z.png?id=113');
INSERT INTO "Meal" ("id", "name", "price", "photoUrl") VALUES ('a700727b-021d-45d6-941c-4e05ab1b6309', 'Grilled Salmon', '10.75', 'https://i.imgur.com/YfJQV5z.png?id=117');
INSERT INTO "Meal" ("id", "name", "price", "photoUrl") VALUES ('181c9628-2ba1-4e5c-8efa-144a02ab97bc', 'Spaghetti Carbonara', '10.75', 'https://i.imgur.com/YfJQV5z.png?id=121');
INSERT INTO "Meal" ("id", "name", "price", "photoUrl") VALUES ('6221666d-ec0d-43a3-8dce-d0845a31c574', 'Chicken Caesar Salad', '15.00', 'https://i.imgur.com/YfJQV5z.png?id=125');
INSERT INTO "Meal" ("id", "name", "price", "photoUrl") VALUES ('7f6fc4ba-c06a-4c71-831c-87a92f62a9d4', 'Vegetarian Pizza', '9.00', 'https://i.imgur.com/YfJQV5z.png?id=129');

INSERT INTO "MealTag" ("id", "name", "mealId") VALUES ('01febf3c-bb43-4b8d-aa39-09f31a8661f0', 'GlutenFree', 'c6b890c1-f613-450b-a7dd-4b53fd694d97');
INSERT INTO "MealTag" ("id", "name", "mealId") VALUES ('c9ea324e-343d-4b9f-8999-c81e3a8e6782', 'DairyFree', '19fabef9-cb8b-43f8-b4f3-50fa7dae73c9');
INSERT INTO "MealTag" ("id", "name", "mealId") VALUES ('3bca28f7-ec37-460b-8be6-2aef74f23add', 'Vegetarian', 'fa95ed83-5669-440e-a1b3-7777fabeedd1');
INSERT INTO "MealTag" ("id", "name", "mealId") VALUES ('5122f23a-72ae-4357-acc6-21acf2db83d0', 'GlutenFree', 'a700727b-021d-45d6-941c-4e05ab1b6309');
INSERT INTO "MealTag" ("id", "name", "mealId") VALUES ('429fe134-46a5-48a5-ad5c-fde5d4b1a5ae', 'GlutenFree', '181c9628-2ba1-4e5c-8efa-144a02ab97bc');
INSERT INTO "MealTag" ("id", "name", "mealId") VALUES ('9a1bf38a-d49f-47b1-89fe-351869a52052', 'DairyFree', 'a700727b-021d-45d6-941c-4e05ab1b6309');
INSERT INTO "MealTag" ("id", "name", "mealId") VALUES ('8f84e51c-84a6-4703-8947-42e5291060db', 'Vegan', '73e7ec4a-4ed7-488d-993f-5a9a8d4229c2');
INSERT INTO "MealTag" ("id", "name", "mealId") VALUES ('ee9a8b43-b721-4206-b89e-ddc193e93a2b', 'DairyFree', '3acea5df-4b43-4c56-ba13-cf3b1561e556');
INSERT INTO "MealTag" ("id", "name", "mealId") VALUES ('3a78f03b-4645-46b9-8847-96dd389f896c', 'Vegetarian', '73e7ec4a-4ed7-488d-993f-5a9a8d4229c2');
INSERT INTO "MealTag" ("id", "name", "mealId") VALUES ('2ca32e44-871d-4a85-8c85-ebe25abb32d9', 'Vegetarian', '29755f2b-2c5a-480c-906c-9ab920905ecb');

INSERT INTO "Customer" ("id", "name", "parentContact", "class", "balance") VALUES ('aa952725-e063-4400-8620-4072c62b2aeb', 'Emily Davis', 'james.wilsonexample.com', 'Grade 5', '30.00');
INSERT INTO "Customer" ("id", "name", "parentContact", "class", "balance") VALUES ('5f690d07-c67a-4738-8616-71e02ba350d7', 'Emily Davis', 'emily.davisexample.com', 'Grade 5', '10.00');
INSERT INTO "Customer" ("id", "name", "parentContact", "class", "balance") VALUES ('82eca4e4-3749-4518-9fe3-df36adb78fe7', 'Michael Smith', 'james.wilsonexample.com', 'Grade 4', '15.75');
INSERT INTO "Customer" ("id", "name", "parentContact", "class", "balance") VALUES ('07fbdb1c-6f2d-4916-b269-421ff8e3c431', 'Sophia Brown', 'james.wilsonexample.com', 'Grade 4', '15.75');
INSERT INTO "Customer" ("id", "name", "parentContact", "class", "balance") VALUES ('4f5f5af2-dcdd-4514-9578-9b7452f038cd', 'Emily Davis', 'michael.smithexample.com', 'Grade 4', '40.20');
INSERT INTO "Customer" ("id", "name", "parentContact", "class", "balance") VALUES ('8afa4842-ff31-4fed-b849-d94ea9277d77', 'Alice Johnson', 'sophia.brownexample.com', 'Grade 2', '10.00');
INSERT INTO "Customer" ("id", "name", "parentContact", "class", "balance") VALUES ('38e98a54-6316-4c95-be4d-1627c5ae3900', 'Alice Johnson', 'michael.smithexample.com', 'Grade 5', '25.50');
INSERT INTO "Customer" ("id", "name", "parentContact", "class", "balance") VALUES ('579f36cc-bd74-454f-8dba-fdd31de17d3b', 'James Wilson', 'alice.johnsonexample.com', 'Grade 2', '40.20');
INSERT INTO "Customer" ("id", "name", "parentContact", "class", "balance") VALUES ('7a4bee18-bda6-45fa-a749-05e64dca73ff', 'Alice Johnson', 'sophia.brownexample.com', 'Grade 5', '15.75');
INSERT INTO "Customer" ("id", "name", "parentContact", "class", "balance") VALUES ('4205ad2a-2ff9-4796-ab4e-69ea4e3c1142', 'Sophia Brown', 'sophia.brownexample.com', 'Grade 3', '10.00');

INSERT INTO "Order" ("id", "date", "amount", "paymentMethod", "customerId") VALUES ('6c17518a-a8ae-4cda-b3cb-87fb0054011e', '2024-03-09T17:09:31.873Z', '25.50', 'Cash', '8afa4842-ff31-4fed-b849-d94ea9277d77');
INSERT INTO "Order" ("id", "date", "amount", "paymentMethod", "customerId") VALUES ('942662e5-9032-4ebc-9fea-15d2a0467f8b', '2025-01-30T17:42:10.484Z', '25.50', 'Cash', '4f5f5af2-dcdd-4514-9578-9b7452f038cd');
INSERT INTO "Order" ("id", "date", "amount", "paymentMethod", "customerId") VALUES ('437847cf-090c-4c6d-b318-7c4abb6f94ba', '2023-11-10T11:04:48.868Z', '32.10', 'Balance', '07fbdb1c-6f2d-4916-b269-421ff8e3c431');
INSERT INTO "Order" ("id", "date", "amount", "paymentMethod", "customerId") VALUES ('f9daf8a5-0adb-41e9-9f23-3abce1e3709b', '2023-10-31T00:36:59.024Z', '13.75', 'Balance', '82eca4e4-3749-4518-9fe3-df36adb78fe7');
INSERT INTO "Order" ("id", "date", "amount", "paymentMethod", "customerId") VALUES ('c55166b2-8c68-4fa8-99f4-210dbf33045c', '2025-01-03T10:17:08.178Z', '13.75', 'Balance', '8afa4842-ff31-4fed-b849-d94ea9277d77');
INSERT INTO "Order" ("id", "date", "amount", "paymentMethod", "customerId") VALUES ('37ecbcb5-fff9-44c0-9ccf-d70578d3c9ee', '2025-03-14T16:42:44.132Z', '32.10', 'Cash', '7a4bee18-bda6-45fa-a749-05e64dca73ff');
INSERT INTO "Order" ("id", "date", "amount", "paymentMethod", "customerId") VALUES ('04dca116-97d3-42b7-a055-2b07ce6259b5', '2025-02-08T05:24:47.885Z', '47.20', 'Balance', '82eca4e4-3749-4518-9fe3-df36adb78fe7');
INSERT INTO "Order" ("id", "date", "amount", "paymentMethod", "customerId") VALUES ('ae7513d7-204f-4305-a33c-4cb85b8f8275', '2024-01-03T16:34:52.283Z', '8.99', 'Balance', '5f690d07-c67a-4738-8616-71e02ba350d7');
INSERT INTO "Order" ("id", "date", "amount", "paymentMethod", "customerId") VALUES ('63996173-8f86-4927-bcdb-eb3a16334193', '2024-04-23T05:55:01.208Z', '47.20', 'Cash', '8afa4842-ff31-4fed-b849-d94ea9277d77');
INSERT INTO "Order" ("id", "date", "amount", "paymentMethod", "customerId") VALUES ('2b8cc119-c0c0-42e4-b7a5-b0b50a1cc71b', '2025-07-03T05:34:43.037Z', '47.20', 'Cash', 'aa952725-e063-4400-8620-4072c62b2aeb');

INSERT INTO "OrderItem" ("id", "quantity", "orderId", "mealId") VALUES ('499e71c1-406b-43ca-a5d5-a8f3b69f00cf', 681, '6c17518a-a8ae-4cda-b3cb-87fb0054011e', '181c9628-2ba1-4e5c-8efa-144a02ab97bc');
INSERT INTO "OrderItem" ("id", "quantity", "orderId", "mealId") VALUES ('7177d9fc-fd73-471f-8f58-1c86d3bba285', 627, '37ecbcb5-fff9-44c0-9ccf-d70578d3c9ee', 'a700727b-021d-45d6-941c-4e05ab1b6309');
INSERT INTO "OrderItem" ("id", "quantity", "orderId", "mealId") VALUES ('c57a3f20-d9d9-498d-86cc-54866797dae2', 827, 'f9daf8a5-0adb-41e9-9f23-3abce1e3709b', '181c9628-2ba1-4e5c-8efa-144a02ab97bc');
INSERT INTO "OrderItem" ("id", "quantity", "orderId", "mealId") VALUES ('8cced44b-64cd-400d-a781-fe47b8fa7a2e', 272, '942662e5-9032-4ebc-9fea-15d2a0467f8b', 'fa95ed83-5669-440e-a1b3-7777fabeedd1');
INSERT INTO "OrderItem" ("id", "quantity", "orderId", "mealId") VALUES ('fd4519a5-1a37-4c8c-bbae-fa2403ad61f2', 153, '37ecbcb5-fff9-44c0-9ccf-d70578d3c9ee', '181c9628-2ba1-4e5c-8efa-144a02ab97bc');
INSERT INTO "OrderItem" ("id", "quantity", "orderId", "mealId") VALUES ('99a19e07-b912-4914-bc00-1f316adac178', 353, '04dca116-97d3-42b7-a055-2b07ce6259b5', '29755f2b-2c5a-480c-906c-9ab920905ecb');
INSERT INTO "OrderItem" ("id", "quantity", "orderId", "mealId") VALUES ('4a3b0e7b-24f4-4e28-a63f-879568358be4', 390, 'ae7513d7-204f-4305-a33c-4cb85b8f8275', '3acea5df-4b43-4c56-ba13-cf3b1561e556');
INSERT INTO "OrderItem" ("id", "quantity", "orderId", "mealId") VALUES ('6df2dcba-9336-43e1-b9d2-b2f31ae4e99a', 660, '6c17518a-a8ae-4cda-b3cb-87fb0054011e', 'c6b890c1-f613-450b-a7dd-4b53fd694d97');
INSERT INTO "OrderItem" ("id", "quantity", "orderId", "mealId") VALUES ('bd6c48f1-8381-4b40-a7b0-e4f51aadf76c', 10, '437847cf-090c-4c6d-b318-7c4abb6f94ba', '7f6fc4ba-c06a-4c71-831c-87a92f62a9d4');
INSERT INTO "OrderItem" ("id", "quantity", "orderId", "mealId") VALUES ('e0701f4e-b4c2-4dc0-8a28-5e20bb114f71', 308, '37ecbcb5-fff9-44c0-9ccf-d70578d3c9ee', 'a700727b-021d-45d6-941c-4e05ab1b6309');

  `

  const sqls = splitSql(sql)

  for (const sql of sqls) {
    try {
      await prisma.$executeRawUnsafe(`${sql}`)
    } catch (error) {
      console.log(`Could not insert SQL: ${error.message}`)
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async error => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
