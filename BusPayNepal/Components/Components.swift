import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

#if canImport(UIKit)
typealias AppKeyboardType = UIKeyboardType
#else
enum AppKeyboardType {
    case `default`
    case emailAddress
    case phonePad
    case numberPad
}
#endif

struct PrimaryButton: View {
    var title: LocalizedStringKey
    var systemImage: String?
    var trailingArrow = false
    var isLoading = false
    var action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if isLoading {
                    ProgressView().tint(AppColors.nearBlack)
                } else if let systemImage {
                    Image(systemName: systemImage)
                }
                Text(title)
                if trailingArrow { Text("->") }
            }
            .font(AppFont.buttonLabel)
            .foregroundStyle(AppColors.nearBlack)
            .frame(maxWidth: .infinity)
            .frame(height: AppMetrics.buttonHeight)
            .background(AppColors.amberCTA, in: RoundedRectangle(cornerRadius: AppMetrics.cornerRadiusButton, style: .continuous))
        }
        .buttonStyle(.plain)
        .pressableScale()
    }
}

struct SecondaryButton: View {
    var title: LocalizedStringKey
    var systemImage: String?
    var action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if let systemImage { Image(systemName: systemImage) }
                Text(title)
            }
            .font(AppFont.buttonLabel)
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .frame(height: AppMetrics.buttonHeight)
            .background(AppColors.darkButton, in: RoundedRectangle(cornerRadius: AppMetrics.cornerRadiusButton, style: .continuous))
        }
        .buttonStyle(.plain)
        .pressableScale()
    }
}

struct AppTextField: View {
    var label: String
    var placeholder: String
    var leadingIcon: String
    @Binding var text: String
    var keyboard: AppKeyboardType = .default
    var isSecure = false
    @FocusState private var focused: Bool
    @State private var visible = false

    var body: some View {
        VStack(alignment: .leading, spacing: 7) {
            Text(label)
                .font(AppFont.bodySecondary)
                .foregroundStyle(AppColors.labelGrey)
            HStack(spacing: 10) {
                Image(systemName: leadingIcon)
                    .frame(width: 22)
                    .foregroundStyle(AppColors.labelGrey)
                if isSecure && !visible {
                    SecureField(placeholder, text: $text)
                        .focused($focused)
                } else {
                    TextField(placeholder, text: $text)
                        .appKeyboardType(keyboard)
                        .appTextInputAutocapitalizationNever()
                        .focused($focused)
                }
                if isSecure {
                    Button { visible.toggle() } label: {
                        Image(systemName: visible ? "eye.slash" : "eye")
                            .foregroundStyle(AppColors.labelGrey)
                    }
                    .buttonStyle(.plain)
                }
            }
            .font(AppFont.bodyPrimary)
            .padding(.horizontal, 14)
            .frame(height: AppMetrics.inputHeight)
            .background(AppColors.cardSurface, in: RoundedRectangle(cornerRadius: AppMetrics.cornerRadiusInput, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: AppMetrics.cornerRadiusInput)
                    .stroke(focused ? AppColors.brandGold : AppColors.inputBorder, lineWidth: 1)
            )
        }
    }
}

// Backward-compatible wrapper.
struct SmartTextField: View {
    var title: String
    var systemImage: String
    @Binding var text: String
    var keyboard: AppKeyboardType = .default
    var secure = false

    var body: some View {
        AppTextField(label: title, placeholder: title, leadingIcon: systemImage, text: $text, keyboard: keyboard, isSecure: secure)
    }
}

enum StatusBadgeVariant {
    case completed
    case ready
    case notVerified
    case offline
    case nfcActive

    var title: String {
        switch self {
        case .completed: "COMPLETED"
        case .ready: "READY"
        case .notVerified: "Not Verified"
        case .offline: "Offline"
        case .nfcActive: "NFC ACTIVE"
        }
    }

    var color: Color {
        switch self {
        case .completed, .ready: AppColors.successGreen
        case .notVerified: AppColors.errorRed
        case .offline: AppColors.amberDark
        case .nfcActive: AppColors.nfcBlue
        }
    }
}

struct StatusBadge: View {
    var title: String?
    var color: Color?
    var variant: StatusBadgeVariant?

    init(title: String, color: Color) {
        self.title = title
        self.color = color
        self.variant = nil
    }

    init(_ variant: StatusBadgeVariant) {
        self.title = nil
        self.color = nil
        self.variant = variant
    }

    var body: some View {
        let displayTitle = variant?.title ?? title ?? ""
        let displayColor = variant?.color ?? color ?? AppColors.labelGrey
        Text(displayTitle)
            .font(AppFont.badgeLabel)
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(displayColor.opacity(0.14), in: Capsule())
            .foregroundStyle(displayColor)
    }
}

struct WalletCard: View {
    var wallet: Wallet
    var topUp: () -> Void = {}

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("DIGITAL WALLET")
                .font(.system(size: 11, weight: .semibold))
                .foregroundStyle(AppColors.labelGrey)
            Text(SmartFareFormatter.rupees(wallet.balance))
                .font(AppFont.largeNumber)
                .foregroundStyle(.white)
            HStack(alignment: .bottom) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(wallet.commuterID)
                        .font(.caption)
                    Text(wallet.isVerified ? "Verified Commuter" : "Verification Pending")
                        .font(.subheadline.weight(.bold))
                }
                .foregroundStyle(AppColors.nearBlack)
                Spacer()
                Button(action: topUp) {
                    Text("TOP UP")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundStyle(.white)
                        .frame(height: 32)
                        .padding(.horizontal, 14)
                        .background(AppColors.nearBlack, in: RoundedRectangle(cornerRadius: 8))
                }
                .buttonStyle(.plain)
            }
        }
        .padding(20)
        .background(AppColors.amberCTA, in: RoundedRectangle(cornerRadius: AppMetrics.cornerRadiusCard, style: .continuous))
        .overlay(alignment: .trailing) {
            Rectangle().fill(AppColors.amberDark.opacity(0.28)).frame(width: 8)
        }
        .clipShape(RoundedRectangle(cornerRadius: AppMetrics.cornerRadiusCard, style: .continuous))
    }
}

struct BalanceCard: View {
    var wallet: Wallet

    var body: some View {
        WalletCard(wallet: wallet)
    }
}

struct StatMiniCard: View {
    var label: String
    var value: String

    var body: some View {
        VStack(alignment: .leading, spacing: 7) {
            Text(label.uppercased())
                .font(.system(size: 11, weight: .semibold))
                .foregroundStyle(AppColors.labelGrey)
            Text(value)
                .font(.system(size: 24, weight: .bold))
                .foregroundStyle(AppColors.nearBlack)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(AppColors.quickSelectGrey, in: RoundedRectangle(cornerRadius: 10))
    }
}

struct TripRow: View {
    var trip: Trip

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: trip.iconName)
                .font(.system(size: 18, weight: .semibold))
                .foregroundStyle(AppColors.labelGrey)
                .frame(width: 42, height: 42)
                .background(AppColors.quickSelectGrey, in: Circle())
            VStack(alignment: .leading, spacing: 4) {
                Text(trip.route)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundStyle(AppColors.nearBlack)
                Text(trip.subtitle)
                    .font(.system(size: 12))
                    .foregroundStyle(AppColors.labelGrey)
                Text(SmartFareFormatter.tripTime.string(from: trip.date))
                    .font(.system(size: 12))
                    .foregroundStyle(AppColors.labelGrey)
            }
            Spacer()
            VStack(alignment: .trailing, spacing: 6) {
                Text(SmartFareFormatter.rupees(trip.fare))
                    .font(.subheadline.weight(.bold))
                    .foregroundStyle(AppColors.brandGold)
                StatusBadge(.completed)
            }
        }
        .smartCard()
    }
}

struct RouteCard: View {
    var route: BusRoute
    var action: () -> Void = {}

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Text(route.number)
                    .font(.subheadline.weight(.bold))
                    .foregroundStyle(.white)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 7)
                    .background(AppColors.routeBadgeBg, in: RoundedRectangle(cornerRadius: 8))
                Spacer()
                Image(systemName: "heart")
                    .foregroundStyle(AppColors.labelGrey)
            }

            VStack(alignment: .leading, spacing: 0) {
                routePoint("circle", route.origin, AppColors.labelGrey)
                Rectangle()
                    .fill(AppColors.inputBorder)
                    .frame(width: 1, height: 24)
                    .padding(.leading, 8)
                routePoint("mappin", route.destination, AppColors.brandGold)
            }

            Divider()

            HStack {
                routeStat("FARE", SmartFareFormatter.rupeesShort(route.fare), AppColors.amberCTA)
                routeStat("TIME", route.estimatedDuration, AppColors.nearBlack)
                routeStat("BUSES", "\(route.activeBusCount)", AppColors.successGreen)
            }

            HStack(spacing: 10) {
                Button(action: action) {
                    Text("View Schedule")
                        .font(.subheadline.weight(.bold))
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 44)
                        .background(AppColors.routeBadgeBg, in: RoundedRectangle(cornerRadius: 10))
                }
                .buttonStyle(.plain)
                Button(action: action) {
                    Image(systemName: "map")
                        .foregroundStyle(.white)
                        .frame(width: 44, height: 44)
                        .background(AppColors.routeBadgeBg, in: RoundedRectangle(cornerRadius: 10))
                }
                .buttonStyle(.plain)
            }
        }
        .smartCard()
    }

    private func routePoint(_ icon: String, _ text: String, _ color: Color) -> some View {
        HStack(spacing: 10) {
            Image(systemName: icon)
                .font(.caption.weight(.bold))
                .foregroundStyle(color)
                .frame(width: 18)
            Text(text)
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(AppColors.nearBlack)
        }
    }

    private func routeStat(_ label: String, _ value: String, _ color: Color) -> some View {
        VStack(spacing: 4) {
            Text(label)
                .font(.system(size: 11, weight: .semibold))
                .foregroundStyle(AppColors.labelGrey)
            Text(value)
                .font(.subheadline.weight(.bold))
                .foregroundStyle(color)
        }
        .frame(maxWidth: .infinity)
    }
}

struct TransactionCard: View {
    var transaction: Transaction

    private var color: Color {
        transaction.amount >= 0 ? AppColors.successGreen : AppColors.brandGold
    }

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: transaction.type == .recharge ? "plus.circle.fill" : "bus.fill")
                .font(.title2)
                .foregroundStyle(color)
                .frame(width: 42, height: 42)
                .background(color.opacity(0.12), in: Circle())
            VStack(alignment: .leading, spacing: 4) {
                Text(transaction.route).font(.subheadline.weight(.semibold))
                Text(SmartFareFormatter.shortDate.string(from: transaction.date))
                    .font(.caption)
                    .foregroundStyle(AppColors.labelGrey)
            }
            Spacer()
            Text(SmartFareFormatter.rupees(transaction.amount))
                .font(.subheadline.weight(.bold))
                .foregroundStyle(color)
        }
        .smartCard()
    }
}

struct SectionHeader: View {
    var title: LocalizedStringKey
    var actionTitle: LocalizedStringKey?
    var action: (() -> Void)?

    var body: some View {
        HStack {
            Text(title)
                .font(AppFont.sectionHeading)
                .foregroundStyle(AppColors.brandGold)
            Spacer()
            if let actionTitle, let action {
                Button(actionTitle, action: action)
                    .font(AppFont.bodySecondary.weight(.semibold))
                    .foregroundStyle(AppColors.brandGold)
            }
        }
    }
}

struct ScreenHeader: View {
    var title: String
    var showBack = false
    var trailing: AnyView?
    @Environment(\.dismiss) private var dismiss

    init(_ title: String, showBack: Bool = false, trailing: AnyView? = nil) {
        self.title = title
        self.showBack = showBack
        self.trailing = trailing
    }

    var body: some View {
        HStack {
            if showBack {
                Button { dismiss() } label: {
                    Image(systemName: "chevron.left")
                        .font(.headline)
                        .foregroundStyle(AppColors.nearBlack)
                }
                .buttonStyle(.plain)
            }
            Text(title)
                .font(AppFont.pageTitle)
                .foregroundStyle(AppColors.brandGold)
            Spacer()
            if let trailing { trailing }
        }
    }
}

struct BottomNavBar: View {
    @Binding var selection: MainTab

    var body: some View {
        HStack {
            navItem(.home, "house", "Home")
            navItem(.history, "clock.arrow.circlepath", "History")
            Button {
                selection = .nfc
                #if canImport(UIKit)
                UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                #endif
            } label: {
                VStack(spacing: 4) {
                    Image(systemName: "wave.3.right.circle.fill")
                        .font(.system(size: 25, weight: .bold))
                    Text("Tap").font(.caption2.weight(.bold))
                }
                .foregroundStyle(.white)
                .frame(width: 48, height: 48)
                .background(AppColors.amberCTA, in: Circle())
                .shadow(color: .black.opacity(0.18), radius: 8, y: 4)
                .offset(y: -12)
            }
            .buttonStyle(.plain)
            navItem(.routes, "map", "Routes")
            navItem(.settings, "gearshape", "Settings")
        }
        .padding(.horizontal, 14)
        .padding(.top, 10)
        .padding(.bottom, 8)
        .background(AppColors.cardSurface)
        .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
        .shadow(color: .black.opacity(0.08), radius: 12, y: -2)
        .padding(.horizontal, 12)
        .padding(.bottom, 8)
    }

    private func navItem(_ tab: MainTab, _ icon: String, _ label: String) -> some View {
        Button { selection = tab } label: {
            VStack(spacing: 4) {
                Image(systemName: selection == tab ? "\(icon).fill" : icon)
                    .font(.system(size: 18, weight: .semibold))
                Text(label).font(.caption2.weight(.medium))
            }
            .foregroundStyle(selection == tab ? AppColors.amberCTA : AppColors.labelGrey)
            .frame(maxWidth: .infinity)
            .frame(height: 50)
        }
        .buttonStyle(.plain)
    }
}

struct BottomNavBar4: View {
    @Binding var selection: MainTab

    var body: some View {
        HStack(spacing: 8) {
            navItem(.home, "house", "Home")
            navItem(.settings, "wallet.pass", "Wallet")
            navItem(.routes, "map", "Routes")
            navItem(.history, "clock.arrow.circlepath", "History")
        }
        .padding(10)
        .background(AppColors.cardSurface)
        .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
        .shadow(color: .black.opacity(0.08), radius: 12, y: -2)
        .padding(.horizontal, 12)
        .padding(.bottom, 8)
    }

    private func navItem(_ tab: MainTab, _ icon: String, _ label: String) -> some View {
        Button { selection = tab } label: {
            HStack(spacing: 5) {
                Image(systemName: icon)
                Text(label)
            }
            .font(.caption.weight(.semibold))
            .foregroundStyle(selection == tab ? AppColors.nearBlack : AppColors.labelGrey)
            .padding(.horizontal, 10)
            .frame(maxWidth: .infinity)
            .frame(height: 38)
            .background(selection == tab ? AppColors.amberCTA.opacity(0.24) : Color.clear, in: Capsule())
        }
        .buttonStyle(.plain)
    }
}

extension View {
    @ViewBuilder
    func appKeyboardType(_ type: AppKeyboardType) -> some View {
        #if canImport(UIKit)
        self.keyboardType(type)
        #else
        self
        #endif
    }

    @ViewBuilder
    func appTextInputAutocapitalizationNever() -> some View {
        #if canImport(UIKit)
        self.textInputAutocapitalization(.never)
        #else
        self
        #endif
    }
}

#if DEBUG
#Preview("Components") {
    VStack(spacing: 16) {
        WalletCard(wallet: SampleData.wallet)
        TripRow(trip: SampleData.trips[0])
        RouteCard(route: SampleData.routes[0])
        PrimaryButton(title: "Sign In", trailingArrow: true) {}
    }
    .padding()
    .background(AppColors.pageBackground)
}
#endif
