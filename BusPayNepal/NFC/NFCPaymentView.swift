import SwiftUI

struct NFCPaymentView: View {
    @EnvironmentObject private var nfc: NFCPaymentViewModel
    @EnvironmentObject private var wallet: WalletViewModel
    @EnvironmentObject private var appState: AppState
    @State private var pulse = false

    var body: some View {
        Group {
            switch nfc.state {
            case .success(let result):
                successView(result)
            default:
                communicatingView
            }
        }
        .onAppear {
            pulse = true
            if case .idle = nfc.state {
                Task { await nfc.startScan(currentBalance: wallet.wallet.balance) }
            }
        }
        .onChange(of: nfc.state) { _, state in
            if case .success(let result) = state {
                wallet.applyNFCPayment(result)
            }
        }
    }

    private var communicatingView: some View {
        VStack(spacing: 20) {
            HStack {
                Button { appState.selectedTab = .home } label: {
                    Image(systemName: "xmark")
                        .foregroundStyle(AppColors.nearBlack)
                }
                Spacer()
                Text("Bus Pay Nepal")
                    .font(AppFont.sectionHeading)
                    .foregroundStyle(AppColors.nearBlack)
                Spacer()
                Image(systemName: "wave.3.right.circle")
                    .foregroundStyle(AppColors.brandGold)
            }
            .padding(.top, 18)

            Spacer()
            ZStack {
                ForEach(0..<3, id: \.self) { index in
                    Circle()
                        .stroke(AppColors.amberCTA.opacity(0.28), lineWidth: 2)
                        .frame(width: 120 + CGFloat(index * 42), height: 120 + CGFloat(index * 42))
                        .scaleEffect(pulse ? 1.22 : 0.72)
                        .opacity(pulse ? 0 : 1)
                        .animation(.easeInOut(duration: 1.0).repeatForever().delay(Double(index) * 0.18), value: pulse)
                }
                Circle()
                    .fill(AppColors.amberCTA)
                    .frame(width: 80, height: 80)
                    .overlay(Image(systemName: "wave.3.right.circle.fill").font(.system(size: 34)).foregroundStyle(.white))
            }
            .frame(height: 210)

            VStack(spacing: 8) {
                Text("Communicating...")
                    .font(.title3.weight(.bold))
                    .foregroundStyle(AppColors.amberCTA)
                Text("NFC ACTIVE")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(AppColors.labelGrey)
                Text("Hold your phone near validator")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundStyle(AppColors.nearBlack)
                Text("Keep the top edge close to the reader until boarding is confirmed.")
                    .font(AppFont.bodySecondary)
                    .foregroundStyle(AppColors.labelGrey)
                    .multilineTextAlignment(.center)
            }

            HStack(spacing: 12) {
                miniCard("BALANCE", SmartFareFormatter.rupees(wallet.wallet.balance))
                miniCard("GATEWAY", "SmartFare")
            }

            Button { nfc.reset(); appState.selectedTab = .home } label: {
                Text("Cancel Tap")
                    .font(AppFont.buttonLabel)
                    .foregroundStyle(AppColors.labelGrey)
                    .frame(maxWidth: .infinity)
                    .frame(height: 52)
                    .background(AppColors.quickSelectGrey, in: RoundedRectangle(cornerRadius: 14))
            }
            .buttonStyle(.plain)
            Spacer()
        }
        .padding(22)
        .padding(.bottom, 96)
        .background(
            ZStack {
                Color(hex: "E8ECEF")
                GridPattern().opacity(0.2)
            }
            .ignoresSafeArea()
        )
    }

    private func successView(_ result: NFCPaymentResult) -> some View {
        VStack(spacing: 22) {
            Spacer()
            Text("Boarding Confirmed")
                .font(.system(size: 28, weight: .bold))
                .foregroundStyle(AppColors.successGreen)
                .multilineTextAlignment(.center)
            Text("Enjoy your ride on the Green Line!")
                .font(AppFont.bodyPrimary)
                .foregroundStyle(AppColors.nearBlack)
            VStack(spacing: 14) {
                nfcDetail("FARE DEDUCTED", SmartFareFormatter.rupees(result.fare), AppColors.brandGold)
                nfcDetail("NEW BALANCE", SmartFareFormatter.rupees(result.newBalance), AppColors.successGreen)
            }
            .smartCard()
            Button { appState.selectedTab = .routes } label: {
                Text("View Route Map")
                    .font(AppFont.buttonLabel)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: AppMetrics.buttonHeight)
                    .background(AppColors.routeBadgeBg, in: RoundedRectangle(cornerRadius: AppMetrics.cornerRadiusButton))
            }
            .buttonStyle(.plain)
            Spacer()
        }
        .padding(24)
        .background(AppColors.cardSurface.ignoresSafeArea())
    }

    private func miniCard(_ label: String, _ value: String) -> some View {
        VStack(spacing: 6) {
            Text(label)
                .font(.system(size: 11, weight: .semibold))
                .foregroundStyle(AppColors.labelGrey)
            Text(value)
                .font(.subheadline.weight(.bold))
                .foregroundStyle(AppColors.nearBlack)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(AppColors.cardSurface, in: RoundedRectangle(cornerRadius: 12))
    }

    private func nfcDetail(_ title: String, _ value: String, _ color: Color) -> some View {
        HStack {
            Text(title)
                .font(.system(size: 11, weight: .semibold))
                .foregroundStyle(AppColors.labelGrey)
            Spacer()
            Text(value)
                .font(.headline.weight(.bold))
                .foregroundStyle(color)
        }
    }
}

struct GridPattern: View {
    var body: some View {
        GeometryReader { proxy in
            Path { path in
                let spacing: CGFloat = 28
                var x: CGFloat = 0
                while x < proxy.size.width {
                    path.move(to: CGPoint(x: x, y: 0))
                    path.addLine(to: CGPoint(x: x, y: proxy.size.height))
                    x += spacing
                }
                var y: CGFloat = 0
                while y < proxy.size.height {
                    path.move(to: CGPoint(x: 0, y: y))
                    path.addLine(to: CGPoint(x: proxy.size.width, y: y))
                    y += spacing
                }
            }
            .stroke(AppColors.labelGrey, lineWidth: 0.5)
        }
    }
}

#if DEBUG
#Preview("NFC Tap") {
    NFCPaymentView()
        .environmentObject(NFCPaymentViewModel(nfcService: CoreNFCService()))
        .environmentObject(WalletViewModel(walletService: MockWalletService()))
        .environmentObject(AppState())
}
#endif
