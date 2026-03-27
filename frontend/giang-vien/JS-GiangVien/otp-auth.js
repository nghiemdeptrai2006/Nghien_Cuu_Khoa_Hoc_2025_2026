// OTP Authentication for Lecturer
// Injects a modal into the UI to require OTP verification via EmailJS

const EMAILJS_SERVICE_ID = 'service_x7ouffq';
const EMAILJS_TEMPLATE_ID = 'template_03v04ni';
const EMAILJS_PUBLIC_KEY = 'D3OtXZ6gGeH4kE2Jq';
const ADMIN_EMAIL = 'nguyentrongnghiem2006@gmail.com'; 

let currentOTP = null;
let pendingAction = null;

function injectOtpModal() {
    if (document.getElementById('lecturer-otp-modal')) return;

    const modalHTML = `
    <div id="lecturer-otp-modal" class="modal-overlay">
      <div class="modal-content" style="max-width: 400px; text-align: center;">
        <div class="modal-header">
          <h3>Xác thực bảo mật</h3>
          <button class="close-btn" onclick="closeOtpModal()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <i class="fas fa-envelope-open-text fa-3x" style="color: var(--blue); margin-bottom: 15px;"></i>
          <p>Mã xác thực (OTP) đã được gửi đến email quản trị: <strong>${ADMIN_EMAIL}</strong>.</p>
          <p style="font-size: 13px; color: var(--danger); margin-bottom: 15px;">Vui lòng nhập mã 6 số để tiếp tục tải tài liệu lên.</p>
          <div class="form-group">
            <input type="text" id="otp-verify-input" class="form-control" placeholder="Nhập mã 6 chữ số" maxlength="6" style="text-align: center; font-size: 18px; letter-spacing: 5px; font-weight: bold;">
          </div>
        </div>
        <div class="modal-footer" style="text-align: center;">
          <button class="btn-save" onclick="verifyLecturerOtp()"><i class="fas fa-check-circle"></i> Xác nhận</button>
          <button class="btn-cancel" onclick="resendLecturerOtp()" style="background-color: #6c757d;"><i class="fas fa-redo"></i> Gửi lại</button>
        </div>
      </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function generateOTP() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

window.requireOtpBeforeAction = async function(actionCallback) {
    if (typeof emailjs === 'undefined') {
        alert("Thư viện EmailJS chưa được tải!");
        return;
    }

    injectOtpModal();
    pendingAction = actionCallback;
    currentOTP = generateOTP();

    // Send OTP using EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);
    
    // Disable buttons temporarily while sending
    try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            to_email: ADMIN_EMAIL,
            otp_code: currentOTP
        });
        
        document.getElementById('otp-verify-input').value = "";
        document.getElementById('lecturer-otp-modal').classList.add('active');
        document.getElementById('otp-verify-input').focus();
    } catch (error) {
        console.error('EmailJS Error:', error);
        alert("Lỗi khi gửi email xác thực. Vui lòng thử lại sau.");
    }
}

window.closeOtpModal = function() {
    document.getElementById('lecturer-otp-modal').classList.remove('active');
    pendingAction = null;
    currentOTP = null;
}

window.verifyLecturerOtp = function() {
    const userInput = document.getElementById('otp-verify-input').value.trim();
    if (!userInput || userInput.length !== 6) {
        alert("Vui lòng nhập đủ mã OTP 6 chữ số.");
        return;
    }
    if (userInput !== currentOTP) {
        alert("Mã OTP không chính xác. Vui lòng kiểm tra lại email.");
        document.getElementById('otp-verify-input').value = "";
        document.getElementById('otp-verify-input').focus();
        return;
    }
    
    // OTP is correct! Execute pending action
    document.getElementById('lecturer-otp-modal').classList.remove('active');
    if (pendingAction) {
        pendingAction();
    }
    pendingAction = null;
    currentOTP = null;
}

window.resendLecturerOtp = async function() {
    currentOTP = generateOTP();
    try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            to_email: ADMIN_EMAIL,
            otp_code: currentOTP
        });
        alert("Đã gửi mã OTP mới thành công!");
    } catch (error) {
        console.error('EmailJS Error:', error);
        alert("Lỗi khi gửi lại email xác thực.");
    }
}


