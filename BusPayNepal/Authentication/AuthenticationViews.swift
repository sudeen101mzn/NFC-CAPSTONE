import PhotosUI
import SwiftUI

struct AuthenticationFlowView: View {
    var body: some View {
        NavigationStack {
            LoginView()
        }
    }
}

struct LoginView: View {
    @EnvironmentObject private var auth: AuthViewModel
    @EnvironmentObject private var appState: AppState
    @State private var identifier = ""
    @State private var password = ""
    @State private var showError = false

    var body: some View {
        ScrollView(.vertical, showsIndicators: true) {
            VStack(spacing: 28) {
                VStack(spacing: 7) {
                    Text("Bus Pay Nepal")
                        .font(AppFont.brandTitle)
                        .foregroundStyle(AppColors.brandGold)
                    Text("Rapid Transit, Seamless Payments")
                        .font(AppFont.bodySecondary)
                        .foregroundStyle(AppColors.labelGrey)
                }
                .frame(maxWidth: .infinity)
                .padding(.top, 56)

                VStack(alignment: .leading, spacing: 16) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Namaste!")
                            .font(.system(size: 24, weight: .bold))
                        Text("Welcome to SmartFare")
                            .font(.system(size: 18, weight: .bold))
                    }
                    .foregroundStyle(AppColors.nearBlack)

                    AppTextField(label: "Email or Phone", placeholder: "+977 9800776655", leadingIcon: "person", text: $identifier, keyboard: .emailAddress)
                    AppTextField(label: "Password", placeholder: "Password", leadingIcon: "lock", text: $password, isSecure: true)

                    Button("Forgot Password?") {}
                        .font(AppFont.bodySecondary.weight(.semibold))
                        .foregroundStyle(AppColors.brandGold)
                        .frame(maxWidth: .infinity, alignment: .trailing)

                    PrimaryButton(title: "Sign In", isLoading: auth.isLoading) {
                        Task { await signIn(role: .passenger) }
                    }
                    .disabled(auth.isLoading)

                    HStack {
                        Rectangle().fill(AppColors.inputBorder).frame(height: 1)
                        Text("OR CONTINUE WITH")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundStyle(AppColors.labelGrey)
                        Rectangle().fill(AppColors.inputBorder).frame(height: 1)
                    }

                    HStack(spacing: 12) {
                        socialButton("apple.logo")
                        socialButton("g.circle")
                    }

                    HStack {
                        Spacer()
                        Text("New here?")
                            .foregroundStyle(AppColors.labelGrey)
                        NavigationLink("Register") { RegisterView() }
                            .foregroundStyle(AppColors.brandGold)
                            .fontWeight(.semibold)
                        Spacer()
                    }
                    .font(AppFont.bodySecondary)

                    NavigationLink("Register as Driver") {
                        DriverRegistrationView()
                    }
                    .font(.subheadline.weight(.bold))
                    .foregroundStyle(AppColors.brandGold)
                    .frame(maxWidth: .infinity)
                }
                .padding(20)
                .background(AppColors.cardSurface, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
            }
            .padding(20)
        }
        .background(AppColors.signInBackground.ignoresSafeArea())
        .alert("Login Failed", isPresented: $showError) {
            Button("OK", role: .cancel) {}
        } message: {
            Text(auth.errorMessage ?? "Please check your credentials.")
        }
    }

    private func socialButton(_ icon: String) -> some View {
        Button {} label: {
            Image(systemName: icon)
                .font(.headline)
                .foregroundStyle(AppColors.nearBlack)
                .frame(maxWidth: .infinity)
                .frame(height: 46)
                .background(AppColors.quickSelectGrey, in: RoundedRectangle(cornerRadius: 12))
        }
        .buttonStyle(.plain)
    }

    private func signIn(role: UserRole) async {
        let loginID = identifier.isEmpty ? "nipun@example.com" : identifier
        let loginPassword = password.isEmpty ? "Password123" : password
        await auth.signIn(identifier: loginID, password: loginPassword)
        if auth.errorMessage == nil {
            appState.userRole = role
        } else {
            showError = true
        }
    }
}

struct RegisterView: View {
    @EnvironmentObject private var auth: AuthViewModel
    @EnvironmentObject private var appState: AppState
    @State private var selectedPhoto: PhotosPickerItem?
    @State private var fullName = ""
    @State private var phone = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var acceptedTerms = false
    @State private var showError = false
    @State private var errorMessage = ""

    var body: some View {
        ScrollView(.vertical, showsIndicators: true) {
            VStack(alignment: .leading, spacing: 18) {
                ScreenHeader("Create Account", showBack: true)

                VStack(spacing: 16) {
                    PhotosPicker(selection: $selectedPhoto, matching: .images) {
                        VStack(spacing: 8) {
                            ZStack(alignment: .bottomTrailing) {
                                Circle()
                                    .fill(AppColors.quickSelectGrey)
                                    .frame(width: 80, height: 80)
                                    .overlay(Image(systemName: "person.fill").foregroundStyle(AppColors.labelGrey).font(.title))
                                Circle()
                                    .fill(AppColors.amberCTA)
                                    .frame(width: 24, height: 24)
                                    .overlay(Image(systemName: "camera.fill").font(.caption2).foregroundStyle(.white))
                            }
                            Text("Tap to upload profile photo")
                                .font(AppFont.bodySecondary)
                                .foregroundStyle(AppColors.labelGrey)
                        }
                        .frame(maxWidth: .infinity)
                    }

                    AppTextField(label: "Full Name", placeholder: "Your full name", leadingIcon: "person", text: $fullName)
                    AppTextField(label: "Phone Number", placeholder: "+977 98XXXXXXXX", leadingIcon: "phone", text: $phone, keyboard: .phonePad)
                    AppTextField(label: "Email Address", placeholder: "you@example.com", leadingIcon: "envelope", text: $email, keyboard: .emailAddress)
                    AppTextField(label: "Password", placeholder: "Password", leadingIcon: "lock", text: $password, isSecure: true)
                    AppTextField(label: "Confirm Password", placeholder: "Confirm password", leadingIcon: "checkmark.shield", text: $confirmPassword, isSecure: true)

                    Toggle(isOn: $acceptedTerms) {
                        Text("I agree to the Terms of Service and Privacy Policy of SmartFare.")
                            .font(AppFont.bodySecondary)
                            .foregroundStyle(AppColors.nearBlack)
                    }
                    .toggleStyle(.appCheckbox)
                    .tint(AppColors.amberCTA)

                    PrimaryButton(title: "Create Account", trailingArrow: true, isLoading: auth.isLoading) {
                        Task { await register() }
                    }

                    HStack {
                        Spacer()
                        Text("Already have an account?")
                        NavigationLink("Sign In") { LoginView() }
                            .fontWeight(.semibold)
                            .foregroundStyle(AppColors.brandGold)
                        Spacer()
                    }
                    .font(AppFont.bodySecondary)
                    .foregroundStyle(AppColors.labelGrey)
                }
                .smartCard()
            }
            .padding(20)
        }
        .navigationBarBackButtonHidden(true)
        .background(AppColors.pageBackground.ignoresSafeArea())
        .alert("Registration Error", isPresented: $showError) {
            Button("OK", role: .cancel) {}
        } message: {
            Text(errorMessage)
        }
    }

    private func register() async {
        guard !fullName.isEmpty, !phone.isEmpty, !email.isEmpty, !password.isEmpty, !confirmPassword.isEmpty else { return fail("All fields are required.") }
        guard password == confirmPassword else { return fail("Passwords do not match.") }
        guard acceptedTerms else { return fail("Please accept the terms to continue.") }
        await auth.register(RegisterRequest(fullName: fullName, phone: phone, email: email, password: password))
        if let error = auth.errorMessage {
            fail(error)
        } else {
            appState.userRole = .passenger
        }
    }

    private func fail(_ message: String) {
        errorMessage = message
        showError = true
    }
}

struct DriverRegistrationView: View {
    @EnvironmentObject private var auth: AuthViewModel
    @EnvironmentObject private var appState: AppState
    @State private var name = ""
    @State private var phone = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var plate = ""
    @State private var license = ""

    var body: some View {
        ScrollView(.vertical, showsIndicators: true) {
            VStack(alignment: .leading, spacing: 18) {
                ScreenHeader("Driver Registration", showBack: true, trailing: AnyView(StatusBadge(.notVerified)))
                Text("Submit your personal, vehicle, and licensing details for SmartFare driver verification.")
                    .font(AppFont.bodySecondary)
                    .foregroundStyle(AppColors.labelGrey)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: .infinity)

                VStack(alignment: .leading, spacing: 16) {
                    sectionDivider("Personal Information")
                    AppTextField(label: "Full Name", placeholder: "Driver name", leadingIcon: "person", text: $name)
                    AppTextField(label: "Phone Number", placeholder: "+977 98XXXXXXXX", leadingIcon: "phone", text: $phone, keyboard: .phonePad)
                    AppTextField(label: "Email Address", placeholder: "driver@example.com", leadingIcon: "envelope", text: $email, keyboard: .emailAddress)
                    AppTextField(label: "Password", placeholder: "Password", leadingIcon: "lock", text: $password, isSecure: true)
                    AppTextField(label: "Confirm Password", placeholder: "Confirm password", leadingIcon: "checkmark.shield", text: $confirmPassword, isSecure: true)
                    sectionDivider("Vehicle & Licensing")
                    AppTextField(label: "Bus Plate Number", placeholder: "BA 2 PA 1234", leadingIcon: "bus", text: $plate)
                    AppTextField(label: "License Number", placeholder: "License number", leadingIcon: "person.text.rectangle", text: $license)
                    PrimaryButton(title: "Submit Application", systemImage: "paperplane.fill") {
                        Task { await submit() }
                    }
                }
                .smartCard()
            }
            .padding(20)
        }
        .navigationBarBackButtonHidden(true)
        .background(AppColors.pageBackground.ignoresSafeArea())
    }

    private func sectionDivider(_ title: String) -> some View {
        HStack {
            Text(title)
                .font(AppFont.sectionHeading)
                .foregroundStyle(AppColors.brandGold)
            Rectangle().fill(AppColors.inputBorder).frame(height: 1)
        }
    }

    private func submit() async {
        await auth.signIn(identifier: "nipun@example.com", password: "Password123")
        appState.userRole = .driver
    }
}

extension ToggleStyle where Self == AppCheckboxToggleStyle {
    static var appCheckbox: AppCheckboxToggleStyle { AppCheckboxToggleStyle() }
}

struct AppCheckboxToggleStyle: ToggleStyle {
    func makeBody(configuration: Configuration) -> some View {
        Button { configuration.isOn.toggle() } label: {
            HStack(alignment: .top, spacing: 10) {
                Image(systemName: configuration.isOn ? "checkmark.square.fill" : "square")
                    .foregroundStyle(configuration.isOn ? AppColors.amberCTA : AppColors.labelGrey)
                configuration.label
            }
        }
        .buttonStyle(.plain)
    }
}

#if DEBUG
#Preview("Sign In") {
    LoginView()
        .environmentObject(AuthViewModel(authService: MockAuthService()))
        .environmentObject(AppState())
}
#endif
