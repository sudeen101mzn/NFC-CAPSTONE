import SwiftUI

struct RootView: View {
    @EnvironmentObject private var auth: AuthViewModel
    @EnvironmentObject private var appState: AppState

    var body: some View {
        Group {
            if auth.isAuthenticated {
                MainTabShell()
                    .transition(.opacity.combined(with: .scale(scale: 0.98)))
            } else {
                AuthenticationFlowView()
                    .transition(.move(edge: .bottom).combined(with: .opacity))
            }
        }
        .onChange(of: auth.isAuthenticated) { _, authenticated in
            if !authenticated { appState.userRole = .unauthenticated }
        }
        .animation(.spring(response: 0.45, dampingFraction: 0.86), value: auth.isAuthenticated)
    }
}

struct MainTabShell: View {
    @EnvironmentObject private var appState: AppState

    var body: some View {
        ZStack(alignment: .bottom) {
            NavigationStack {
                Group {
                    switch appState.selectedTab {
                    case .home:
                        if appState.userRole == .driver {
                            DriverDashboardView()
                        } else {
                            HomeDashboardView()
                        }
                    case .history:
                        TransactionHistoryView()
                    case .nfc:
                        NFCPaymentView()
                    case .routes:
                        RoutesView()
                    case .settings:
                        SettingsView()
                    }
                }
            }

            if appState.selectedTab == .routes {
                BottomNavBar4(selection: $appState.selectedTab)
            } else {
                BottomNavBar(selection: $appState.selectedTab)
            }
        }
        .ignoresSafeArea(.keyboard, edges: .bottom)
    }
}

struct SettingsView: View {
    @EnvironmentObject private var auth: AuthViewModel
    @EnvironmentObject private var appState: AppState
    @AppStorage("appearance.darkMode") private var darkMode = false

    var body: some View {
        ScrollView(.vertical, showsIndicators: true) {
            VStack(alignment: .leading, spacing: 18) {
                Text("Menu")
                    .font(AppFont.pageTitle)
                    .foregroundStyle(AppColors.nearBlack)

                VStack(spacing: 8) {
                    Text("Logged In As")
                        .font(AppFont.bodySecondary)
                        .foregroundStyle(AppColors.labelGrey)
                    Text(appState.userRole == .driver ? "Driver" : "Passenger")
                        .font(.headline.weight(.bold))
                        .foregroundStyle(AppColors.successGreen)
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(AppColors.quickSelectGrey, in: RoundedRectangle(cornerRadius: 12))

                menuToggle("Dark Mode", icon: "moon.fill", isOn: $darkMode)
                menuRow("Settings", icon: "gearshape")
                menuRow("Fare List", icon: "bag")
                menuRow("About", icon: "info.circle")
                menuRow("Privacy Policy", icon: "lock")
                Button { auth.logout() } label: {
                    menuContent("Logout", icon: "rectangle.portrait.and.arrow.right", trailing: AnyView(EmptyView()))
                }
                .buttonStyle(.plain)
            }
            .padding(20)
            .padding(.bottom, 96)
        }
        .background(AppColors.cardSurface.ignoresSafeArea())
    }

    private func menuRow(_ title: String, icon: String) -> some View {
        Button {} label: {
            menuContent(title, icon: icon, trailing: AnyView(Image(systemName: "chevron.right").foregroundStyle(AppColors.labelGrey)))
        }
        .buttonStyle(.plain)
    }

    private func menuToggle(_ title: String, icon: String, isOn: Binding<Bool>) -> some View {
        menuContent(title, icon: icon, trailing: AnyView(Toggle("", isOn: isOn).labelsHidden().tint(AppColors.amberCTA).animation(.spring(), value: isOn.wrappedValue)))
    }

    private func menuContent(_ title: String, icon: String, trailing: AnyView) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundStyle(AppColors.brandGold)
                .frame(width: 24)
            Text(title)
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(AppColors.nearBlack)
            Spacer()
            trailing
        }
        .padding()
        .background(AppColors.cardSurface, in: RoundedRectangle(cornerRadius: 12))
        .cardShadow()
    }
}

#if DEBUG
#Preview("Passenger Shell") {
    RootView()
        .environmentObject(AppState())
        .environmentObject(AuthViewModel(authService: MockAuthService()))
        .environmentObject(WalletViewModel(walletService: MockWalletService()))
        .environmentObject(RoutesViewModel(routeService: MockRouteService()))
        .environmentObject(NFCPaymentViewModel(nfcService: CoreNFCService()))
}
#endif
