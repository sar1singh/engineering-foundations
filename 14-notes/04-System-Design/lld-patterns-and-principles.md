Intent: Master the "Building Blocks" of clean, extensible code.
Goal: Master the "Building Blocks" of clean, extensible code (SOLID, Design Patterns).


What to keep here:

SOLID Principles: The foundation of object-oriented and functional design.

Creational Patterns: Singleton, Factory, Abstract Factory (common in Node.js for DB connections or Logger classes).

Structural Patterns: Adapter, Proxy, Decorator (essential for middleware and API wrappers).

Behavioral Patterns: Observer (the basis of Node's EventEmitter), Strategy, Command.


Advanced Topics: Rate Limiting logic, Caching strategies, and Idempotency implementations.

## Why is the "Strategy Pattern" preferred over multiple if-else blocks in an API?
Using multiple if-else or switch statements for different business logics (e.g., handling multiple payment gateways like Stripe vs. PayPal) violates the Open-Closed Principle. The Strategy Pattern allows us to define a family of algorithms, encapsulate each one, and make them interchangeable. This makes the system 'Open for Extension' (adding a new gateway) but 'Closed for Modification' (no need to touch the core routing logic).

## Explain the "Dependency Injection" (DI) pattern in the context of Node.js Testing.
DI is a technique where an object receives its dependencies from an external source rather than creating them internally. In Node.js, this is critical for Unit Testing. If a service class creates its own Database instance, it’s hard to mock. By injecting the DB dependency through the constructor, I can easily pass a 'Mock DB' during tests, ensuring my tests are fast and don't rely on a live network.

## Explain the SOLID Principles (Focus on 'S' and 'O').
Single Responsibility Principle (SRP): A class or module should have one, and only one, reason to change. For example, a User class should handle user data, but not the logic for sending an email to that user. We delegate email to a NotificationService.

Open-Closed Principle (OCP): Software entities should be open for extension but closed for modification. We achieve this using interfaces or the Strategy Pattern. If we need to support a new payment method, we add a new class instead of modifying the existing PaymentProcessor logic.

## What is the Observer Pattern in the context of Node.js?
The Observer Pattern defines a one-to-many dependency where one object (the subject) notifies all its observers of state changes. In Node.js, this is natively implemented via the EventEmitter class. It’s the backbone of asynchronous, event-driven architecture. For instance, a 'FileStream' (Subject) emits 'data' events, and various listeners (Observers) process those chunks as they arrive.

## What is the Factory Pattern and when should we use it?
The Factory Pattern provides an interface for creating objects but allows subclasses or a central 'Factory' to decide which class to instantiate.
Use Case: In a multi-database system, I might use a DatabaseFactory. Depending on the environment variable (DB_TYPE), the factory returns either a PostgreSQLInstance or a MongoDBInstance. The rest of the application doesn't care which DB is being used; it just calls 
.connect().

## Explain the Singleton Pattern and its pitfalls in Node.js.
A Singleton ensures a class has only one instance and provides a global point of access to it. In Node.js, the Module System (require/import) acts like a Singleton because modules are cached after the first load.
The Pitfall: While useful for Database pools or Loggers, overusing Singletons makes unit testing difficult because they carry 'global state' across tests. I prefer Dependency Injection over pure Singletons to maintain test isolation.

## How does the Observer Pattern power Node.js?
The Observer pattern involves a 'Subject' maintaining a list of 'Observers' to notify them of state changes. In Node.js, this is the core of the EventEmitter class. It allows for a decoupled architecture where one part of the system (e.g., a File Uploader) can emit an event ('uploaded') without knowing which other parts (e.g., Analytics, Emailer, Logger) are listening to it.

