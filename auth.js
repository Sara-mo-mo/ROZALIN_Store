"use strict";

const messageBox = document.getElementById("authMessage");

function showMessage(message, type = "error") {
    if (!messageBox) return;

    messageBox.textContent = message;
    messageBox.className = `auth-message ${type}`;
    messageBox.hidden = false;
}

function clearMessage() {
    if (!messageBox) return;

    messageBox.textContent = "";
    messageBox.hidden = true;
    messageBox.className = "auth-message";
}

function setError(id, message = "") {
    const element = document.getElementById(id);
    if (element) element.textContent = message;
}

function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.querySelectorAll(".toggle-password").forEach(button => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.target);
        if (!input) return;

        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";

        button.innerHTML = isPassword
            ? '<i class="fa-regular fa-eye-slash"></i>'
            : '<i class="fa-regular fa-eye"></i>';

        button.setAttribute(
            "aria-label",
            isPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
        );
    });
});

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", event => {
        event.preventDefault();
        clearMessage();

        [
            "nameError",
            "emailError",
            "passwordError",
            "confirmPasswordError",
            "termsError"
        ].forEach(id => setError(id));

        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("signupEmail")
            .value.trim().toLowerCase();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;
        const agreed = document.getElementById("agreeTerms").checked;

        let valid = true;

        if (name.length < 3) {
            setError("nameError", "اكتبي الاسم بالكامل (3 أحرف على الأقل).");
            valid = false;
        }

        if (!validEmail(email)) {
            setError("emailError", "أدخلي بريدًا إلكترونيًا صحيحًا.");
            valid = false;
        }

        if (password.length < 8) {
            setError("passwordError", "كلمة المرور يجب أن تكون 8 أحرف على الأقل.");
            valid = false;
        }

        if (password !== confirmPassword) {
            setError("confirmPasswordError", "كلمتا المرور غير متطابقتين.");
            valid = false;
        }

        if (!agreed) {
            setError("termsError", "يجب الموافقة على شروط الاستخدام.");
            valid = false;
        }

        if (!valid) return;

        try {
            localStorage.setItem(
                "rozalinDemoProfile",
                JSON.stringify({ name, email })
            );

            showMessage(
                "تم التحقق من البيانات بنجاح. هذه نسخة تجريبية؛ لإنشاء حساب حقيقي نحتاج إلى خادم آمن.",
                "success"
            );

            signupForm.reset();
        } catch (error) {
            showMessage("تعذر حفظ بيانات العرض التجريبي في المتصفح.");
        }
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", event => {
        event.preventDefault();
        clearMessage();

        setError("emailError");
        setError("passwordError");

        const email = document.getElementById("loginEmail")
            .value.trim();
        const password = document.getElementById("loginPassword").value;

        let valid = true;

        if (!validEmail(email)) {
            setError("emailError", "أدخلي بريدًا إلكترونيًا صحيحًا.");
            valid = false;
        }

        if (!password) {
            setError("passwordError", "أدخلي كلمة المرور.");
            valid = false;
        }

        if (!valid) return;

        showMessage(
            "تم التحقق من الحقول. تسجيل الدخول الحقيقي يحتاج إلى ربط الموقع بنظام مصادقة آمن.",
            "success"
        );
    });
}
const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword) {
    forgotPassword.addEventListener("click", event => {
        event.preventDefault();
        showMessage(
            "استعادة كلمة المرور غير مفعّلة بعد. ستحتاج إلى خدمة إرسال رابط استعادة آمن."
        );
    });
}
const googleLogin = document.getElementById("googleLogin");

if (googleLogin) {
    googleLogin.addEventListener("click", () => {
        showMessage(
            "تسجيل الدخول باستخدام Google يحتاج إلى إعداد OAuth وربط بالخادم."
        );
    });
}
