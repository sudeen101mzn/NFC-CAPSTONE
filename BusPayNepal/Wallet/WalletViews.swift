import SwiftUI

struct WalletView: View {
    @EnvironmentObject private var wallet: WalletViewModel

    var body: some View {
        RechargeView()
            .environmentObject(wallet)
    }
}

struct RechargeView: View {
    @EnvironmentObject private var wallet: WalletViewModel
    @State private var selectedAmount: Decimal = 500
    @State private var customAmount = ""
    @State private var showConfirmation = false

    private let amounts: [Decimal] = [100, 200, 500, 1000, 2000]
    private var amount: Decimal { Decimal(string: customAmount) ?? selectedAmount }

    var body: some View {
        ScrollView(.vertical, showsIndicators: true) {
            VStack(alignment: .leading, spacing: 18) {
                ScreenHeader("Wallet Recharge", showBack: true)

                HStack {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("CURRENT BALANCE")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundStyle(AppColors.labelGrey)
                        Text(SmartFareFormatter.rupees(wallet.wallet.balance))
                            .font(AppFont.largeNumber)
                            .foregroundStyle(AppColors.nearBlack)
                    }
                    Spacer()
                    Image(systemName: "wallet.pass.fill")
                        .font(.title2)
                        .foregroundStyle(.white)
                        .frame(width: 50, height: 50)
                        .background(AppColors.amberCTA, in: Circle())
                }
                .smartCard()

                SectionHeader(title: "Enter Amount")
                HStack {
                    Text("NPR")
                        .font(.headline.weight(.bold))
                        .foregroundStyle(AppColors.amberCTA)
                    TextField("0.00", text: $customAmount)
                        .appKeyboardType(.numberPad)
                        .font(.system(size: 24, weight: .bold))
                }
                .padding(.horizontal, 16)
                .frame(height: 64)
                .background(AppColors.cardSurface, in: RoundedRectangle(cornerRadius: 12))
                .overlay(RoundedRectangle(cornerRadius: 12).stroke(AppColors.amberCTA, lineWidth: 1))

                HStack(spacing: 9) {
                    ForEach(amounts, id: \.self) { item in
                        Button {
                            selectedAmount = item
                            customAmount = ""
                        } label: {
                            Text("\(NSDecimalNumber(decimal: item).intValue)")
                                .font(.caption.weight(.bold))
                                .foregroundStyle(AppColors.nearBlack)
                                .padding(.horizontal, 12)
                                .frame(height: 36)
                                .background(AppColors.quickSelectGrey, in: Capsule())
                                .overlay(Capsule().stroke(amount == item ? AppColors.amberCTA : Color.clear, lineWidth: 1.5))
                        }
                        .buttonStyle(.plain)
                    }
                }

                SectionHeader(title: "Payment Method")
                HStack(spacing: 12) {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(AppColors.quickSelectGrey)
                        .frame(width: 42, height: 42)
                        .overlay(Text("K").font(.headline.weight(.bold)).foregroundStyle(AppColors.brandGold))
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Khalti").font(.headline.weight(.bold))
                        Text("Instant Pay").font(AppFont.bodySecondary).foregroundStyle(AppColors.labelGrey)
                    }
                    Spacer()
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundStyle(AppColors.amberCTA)
                }
                .padding(16)
                .background(Color(hex: "EEF3F7"), in: RoundedRectangle(cornerRadius: 12))
                .overlay(RoundedRectangle(cornerRadius: 12).stroke(AppColors.amberCTA, lineWidth: 1.5))

                PrimaryButton(title: "Confirm Payment", trailingArrow: true) {
                    showConfirmation = true
                }
            }
            .padding(20)
            .padding(.bottom, 96)
        }
        .background(AppColors.pageBackground.ignoresSafeArea())
        .navigationDestination(isPresented: $showConfirmation) {
            PaymentConfirmationView(amount: amount, serviceCharge: 0, total: amount, method: "Khalti")
        }
    }
}

struct PaymentConfirmationView: View {
    @EnvironmentObject private var wallet: WalletViewModel
    let amount: Decimal
    let serviceCharge: Decimal
    let total: Decimal
    let method: String
    @State private var showSuccess = false

    var body: some View {
        ScrollView(.vertical, showsIndicators: true) {
            VStack(alignment: .leading, spacing: 18) {
                ScreenHeader("Bus Pay Nepal", showBack: true, trailing: AnyView(Circle().fill(AppColors.quickSelectGrey).frame(width: 40, height: 40).overlay(Image(systemName: "person.fill").foregroundStyle(AppColors.labelGrey))))

                VStack(alignment: .leading, spacing: 16) {
                    Text("Transaction Summary")
                        .font(AppFont.sectionHeading)
                        .foregroundStyle(AppColors.nearBlack)
                    summaryRow("Recharge Amount", SmartFareFormatter.rupees(amount), .primary)
                    summaryRow("Service Charge", SmartFareFormatter.rupees(serviceCharge), AppColors.successGreen)
                    DashedDivider()
                    HStack {
                        Text("Total Amount").font(.headline.weight(.bold))
                        Spacer()
                        Text(SmartFareFormatter.rupees(total))
                            .font(.title3.weight(.bold))
                            .foregroundStyle(AppColors.amberCTA)
                    }
                }
                .smartCard()
                .background(DiagonalPattern().opacity(0.18))

                HStack(spacing: 12) {
                    Image(systemName: "wallet.pass.fill")
                        .foregroundStyle(.white)
                        .frame(width: 44, height: 44)
                        .background(AppColors.amberCTA, in: Circle())
                    VStack(alignment: .leading, spacing: 4) {
                        Text("KHALTI WALLET INFORMATION")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundStyle(AppColors.labelGrey)
                        Text("Account: 98********")
                            .font(.headline.weight(.bold))
                    }
                    Spacer()
                    Image(systemName: "checkmark.shield.fill")
                        .foregroundStyle(AppColors.successGreen)
                }
                .smartCard()

                StatusBadge(.ready)
                    .frame(maxWidth: .infinity)

                PrimaryButton(title: "Confirm Payment", trailingArrow: true) {
                    Task {
                        await wallet.recharge(amount: amount, method: method)
                        showSuccess = true
                    }
                }
                Button("Cancel") {}
                    .font(AppFont.bodySecondary.weight(.semibold))
                    .foregroundStyle(AppColors.labelGrey)
                    .frame(maxWidth: .infinity)
            }
            .padding(20)
        }
        .background(AppColors.pageBackground.ignoresSafeArea())
        .navigationDestination(isPresented: $showSuccess) {
            RechargeSuccessView(amount: amount, method: "Khalti")
        }
    }

    private func summaryRow(_ title: String, _ value: String, _ color: Color) -> some View {
        HStack {
            Text(title).foregroundStyle(AppColors.labelGrey)
            Spacer()
            Text(value).fontWeight(.bold).foregroundStyle(color)
        }
        .font(AppFont.bodyPrimary)
    }
}

struct RechargeSuccessView: View {
    let amount: Decimal
    let method: String

    var body: some View {
        VStack(spacing: 22) {
            Spacer()
            Image(systemName: "checkmark")
                .font(.system(size: 34, weight: .bold))
                .foregroundStyle(.white)
                .frame(width: 72, height: 72)
                .background(AppColors.successGreen, in: Circle())
            Text("Recharge Successful")
                .font(.system(size: 26, weight: .bold))
            Text("\(SmartFareFormatter.rupees(amount)) has been added to your wallet")
                .font(AppFont.bodySecondary)
                .foregroundStyle(AppColors.labelGrey)
            Divider()
            HStack {
                Text("UPDATED WALLET BALANCE")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(AppColors.labelGrey)
                Text("NPR 1,750")
                    .font(.headline.weight(.bold))
                    .foregroundStyle(AppColors.brandGold)
            }
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 5) {
                    Text("Transaction ID").font(AppFont.bodySecondary).foregroundStyle(AppColors.labelGrey)
                    Text("#SF-RECH-99283").font(.subheadline.weight(.bold))
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 5) {
                    Text("Payment Method").font(AppFont.bodySecondary).foregroundStyle(AppColors.labelGrey)
                    HStack {
                        RoundedRectangle(cornerRadius: 4).fill(AppColors.quickSelectGrey).frame(width: 18, height: 18)
                        Text(method).font(.subheadline.weight(.bold))
                    }
                }
            }
            PrimaryButton(title: "View Transaction", systemImage: "doc.text") {}
            SecondaryButton(title: "Back to Home", systemImage: "house.fill") {}
            Spacer()
            Label("Securely processed by SmartFare Nepal", systemImage: "checkmark.shield")
                .font(.system(size: 12))
                .foregroundStyle(AppColors.labelGrey)
        }
        .padding(24)
        .background(AppColors.cardSurface.ignoresSafeArea())
        .navigationBarBackButtonHidden(true)
    }
}

struct DashedDivider: View {
    var body: some View {
        Rectangle()
            .stroke(style: StrokeStyle(lineWidth: 1, dash: [5, 5]))
            .foregroundStyle(AppColors.inputBorder)
            .frame(height: 1)
    }
}

struct DiagonalPattern: View {
    var body: some View {
        GeometryReader { proxy in
            Path { path in
                let spacing: CGFloat = 18
                var x: CGFloat = -proxy.size.height
                while x < proxy.size.width {
                    path.move(to: CGPoint(x: x, y: proxy.size.height))
                    path.addLine(to: CGPoint(x: x + proxy.size.height, y: 0))
                    x += spacing
                }
            }
            .stroke(AppColors.inputBorder, lineWidth: 1)
        }
    }
}

#if DEBUG
#Preview("Recharge") {
    NavigationStack { RechargeView().environmentObject(WalletViewModel(walletService: MockWalletService())) }
}
#endif
