import Foundation

enum UserRole: String, Codable, CaseIterable {
    case unauthenticated
    case passenger
    case driver
}

struct User: Identifiable, Codable, Hashable {
    let id: UUID
    var fullName: String
    var phone: String
    var email: String
    var commuterID: String
    var verified: Bool
    var profileImageName: String?
}

struct DriverProfile: Identifiable, Codable, Hashable {
    let id: UUID
    var name: String
    var phone: String
    var email: String
    var busPlateNumber: String
    var licenseNumber: String
    var verificationStatus: VerificationStatus
}

enum VerificationStatus: String, Codable, CaseIterable {
    case notVerified = "Not Verified"
    case pending = "Pending Verification"
    case approved = "Approved"
}

struct Wallet: Codable, Hashable {
    var balance: Decimal
    var commuterID: String
    var isVerified: Bool
    var nfcEnabled: Bool
}

enum TransactionType: String, Codable, CaseIterable {
    case all = "All"
    case recharge = "Recharge"
    case travel = "Travel"
    case refund = "Refund"
}

struct Transaction: Identifiable, Codable, Hashable {
    let id: UUID
    var date: Date
    var route: String
    var amount: Decimal
    var type: TransactionType
    var status: String
    var method: String
}

struct Trip: Identifiable, Codable, Hashable {
    let id: UUID
    var route: String
    var subtitle: String
    var date: Date
    var fare: Decimal
    var status: String
    var terminalID: String
    var iconName: String
}

struct BusRoute: Identifiable, Codable, Hashable {
    let id: UUID
    var number: String
    var name: String
    var origin: String
    var destination: String
    var fare: Decimal
    var estimatedDuration: String
    var activeBusCount: Int
    var stops: [String]
}

struct NFCPaymentResult: Identifiable, Hashable {
    let id = UUID()
    var route: String
    var terminalID: String
    var fare: Decimal
    var previousBalance: Decimal
    var newBalance: Decimal
    var scannedAt: Date
}

final class StoredTransaction {
    var id: UUID
    var date: Date
    var route: String
    var amount: Decimal
    var typeRawValue: String
    var status: String
    var method: String

    init(transaction: Transaction) {
        self.id = transaction.id
        self.date = transaction.date
        self.route = transaction.route
        self.amount = transaction.amount
        self.typeRawValue = transaction.type.rawValue
        self.status = transaction.status
        self.method = transaction.method
    }
}

final class StoredTrip {
    var id: UUID
    var route: String
    var subtitle: String
    var date: Date
    var fare: Decimal
    var status: String
    var terminalID: String
    var iconName: String

    init(trip: Trip) {
        self.id = trip.id
        self.route = trip.route
        self.subtitle = trip.subtitle
        self.date = trip.date
        self.fare = trip.fare
        self.status = trip.status
        self.terminalID = trip.terminalID
        self.iconName = trip.iconName
    }
}

enum SampleData {
    static let passenger = User(
        id: UUID(),
        fullName: "Nipun Shakya",
        phone: "9800000000",
        email: "nipun@example.com",
        commuterID: "BPN-2048-77",
        verified: true,
        profileImageName: nil
    )

    static let driver = DriverProfile(
        id: UUID(),
        name: "Rajesh",
        phone: "9812345678",
        email: "rajesh@smartfare.test",
        busPlateNumber: "BA 2 PA 1234",
        licenseNumber: "LIC-90281",
        verificationStatus: .notVerified
    )

    static let wallet = Wallet(balance: 1250, commuterID: "BPN-2048-77", isVerified: true, nfcEnabled: true)

    static let routes: [BusRoute] = [
        .init(id: UUID(), number: "102", name: "Route 102", origin: "Patan Dhoka", destination: "Ratnapark", fare: 25, estimatedDuration: "25m", activeBusCount: 4, stops: ["Patan Dhoka", "Pulchowk", "Tripureshwor", "Ratnapark"]),
        .init(id: UUID(), number: "A1", name: "Route A1", origin: "Koteshwor", destination: "Baneshwor", fare: 30, estimatedDuration: "35m", activeBusCount: 7, stops: ["Koteshwor", "Tinkune", "New Baneshwor", "Baneshwor"])
    ]

    static let trips: [Trip] = [
        .init(id: UUID(), route: "Line 102 Bus", subtitle: "Patan Dhoka to Ratnapark", date: .now.addingTimeInterval(-3600), fare: 25, status: "Completed", terminalID: "TERM-BP-014", iconName: "bus"),
        .init(id: UUID(), route: "Blue Line Metro", subtitle: "Koteshwor to Baneshwor", date: .now.addingTimeInterval(-86400), fare: 45, status: "Completed", terminalID: "TERM-LG-022", iconName: "tram"),
        .init(id: UUID(), route: "Eco-Rickshaw", subtitle: "Jawalakhel local loop", date: .now.addingTimeInterval(-172800), fare: 15, status: "Completed", terminalID: "TERM-RK-011", iconName: "figure.walk")
    ]

    static let transactions: [Transaction] = [
        .init(id: UUID(), date: .now.addingTimeInterval(-600), route: "Wallet Top Up", amount: 500, type: .recharge, status: "Success", method: "Khalti"),
        .init(id: UUID(), date: .now.addingTimeInterval(-3600), route: "Ratnapark - Bouddha", amount: -45, type: .travel, status: "Success", method: "NFC"),
        .init(id: UUID(), date: .now.addingTimeInterval(-172800), route: "Refund", amount: 25, type: .refund, status: "Success", method: "System")
    ]
}
