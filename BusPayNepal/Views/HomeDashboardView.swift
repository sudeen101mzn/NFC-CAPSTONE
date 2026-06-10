import SwiftUI

struct HomeDashboardView: View {
    @EnvironmentObject private var auth: AuthViewModel
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var wallet: WalletViewModel

    var body: some View {
        ScrollView(.vertical, showsIndicators: true) {
            VStack(alignment: .leading, spacing: 20) {
                HStack {
                    Text("Bus Pay Nepal")
                        .font(AppFont.sectionHeading)
                        .foregroundStyle(AppColors.brandGold)
                    Spacer()
                    Image(systemName: "bell")
                        .font(.title3)
                        .foregroundStyle(AppColors.nearBlack)
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text("Namaste, \(auth.currentUser?.fullName.components(separatedBy: " ").first ?? "User Name")")
                        .font(AppFont.pageTitle)
                        .foregroundStyle(AppColors.nearBlack)
                    Text("Ready for your commute today?")
                        .font(AppFont.bodySecondary)
                        .foregroundStyle(AppColors.labelGrey)
                }

                WalletCard(wallet: wallet.wallet) {
                    appState.selectedTab = .settings
                }

                HStack(spacing: 14) {
                    Image(systemName: "wave.3.right.circle.fill")
                        .font(.title2)
                        .foregroundStyle(.white)
                        .frame(width: 48, height: 48)
                        .background(AppColors.successGreen, in: Circle())
                    VStack(alignment: .leading, spacing: 4) {
                        Text("NFC Active")
                            .font(.headline.weight(.bold))
                        Text("Tap device on reader to pay")
                            .font(AppFont.bodySecondary)
                            .foregroundStyle(AppColors.labelGrey)
                    }
                    Spacer()
                    StatusBadge(.ready)
                }
                .smartCard()

                HStack(spacing: 12) {
                    StatMiniCard(label: "Total Trips", value: "42")
                    StatMiniCard(label: "Spent", value: "NPR 4,500")
                }

                SectionHeader(title: "Recent Trips", actionTitle: "View All") {
                    appState.selectedTab = .history
                }

                VStack(spacing: 12) {
                    ForEach(SampleData.trips) { trip in
                        TripRow(trip: trip)
                    }
                }
            }
            .padding(20)
            .padding(.bottom, 96)
        }
        .task { await wallet.load() }
        .background(AppColors.pageBackground.ignoresSafeArea())
    }
}

struct DriverDashboardView: View {
    @EnvironmentObject private var appState: AppState
    @State private var online = false

    var body: some View {
        ScrollView(.vertical, showsIndicators: true) {
            VStack(alignment: .leading, spacing: 18) {
                HStack {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Namaste, \(SampleData.driver.name)")
                            .font(AppFont.bodyPrimary)
                        HStack {
                            Image(systemName: "bus.fill")
                                .foregroundStyle(AppColors.brandGold)
                            Text(SampleData.driver.busPlateNumber)
                                .font(.headline.weight(.bold))
                        }
                    }
                    Spacer()
                    Toggle(online ? "Online" : "Offline", isOn: $online)
                        .labelsHidden()
                        .tint(AppColors.amberCTA)
                        .animation(.spring(), value: online)
                    StatusBadge(online ? .ready : .offline)
                }
                .smartCard()

                HStack(spacing: 12) {
                    Image(systemName: "arrow.triangle.turn.up.right.circle.fill")
                        .font(.title2)
                        .foregroundStyle(.white)
                        .frame(width: 44, height: 44)
                        .background(AppColors.amberCTA, in: Circle())
                    VStack(alignment: .leading, spacing: 4) {
                        Text("CURRENT ROUTE")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundStyle(AppColors.labelGrey)
                        Text("Patan Dhoka - Ratnapark")
                            .font(.system(size: 18, weight: .bold))
                    }
                    Spacer()
                }
                .padding(16)
                .background(AppColors.cardSurface, in: RoundedRectangle(cornerRadius: AppMetrics.cornerRadiusCard))
                .overlay(RoundedRectangle(cornerRadius: AppMetrics.cornerRadiusCard).stroke(AppColors.amberCTA, lineWidth: 1))

                HStack(spacing: 12) {
                    driverMetric("TODAY'S EARNINGS", "NPR 8,200")
                    driverMetric("PASSENGERS", "145")
                }

                SectionHeader(title: "Recent Trips", actionTitle: "View All") {
                    appState.selectedTab = .history
                }
                VStack(spacing: 12) {
                    driverTrip("7:10 AM - 8:05 AM", "Morning Loop", "34 passengers")
                    driverTrip("8:20 AM - 9:10 AM", "Express Run", "41 passengers")
                    driverTrip("9:25 AM - 10:15 AM", "Local Route", "28 passengers")
                }
            }
            .padding(20)
            .padding(.bottom, 96)
        }
        .background(AppColors.pageBackground.ignoresSafeArea())
    }

    private func driverMetric(_ label: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label)
                .font(.system(size: 11, weight: .semibold))
                .foregroundStyle(AppColors.labelGrey)
            Text(value)
                .font(AppFont.largeNumber)
                .foregroundStyle(AppColors.nearBlack)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .smartCard()
    }

    private func driverTrip(_ time: String, _ type: String, _ passengers: String) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 5) {
                Text(time)
                    .font(.subheadline.weight(.bold))
                Text(type)
                    .font(AppFont.bodySecondary)
                    .foregroundStyle(AppColors.labelGrey)
            }
            Spacer()
            Text(passengers)
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(AppColors.brandGold)
        }
        .smartCard()
    }
}

#if DEBUG
#Preview("Passenger Home") {
    HomeDashboardView()
        .environmentObject(AuthViewModel(authService: MockAuthService()))
        .environmentObject(AppState())
        .environmentObject(WalletViewModel(walletService: MockWalletService()))
}
#endif
