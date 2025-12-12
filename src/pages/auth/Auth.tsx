import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import AuthLayout from "../../layouts/AuthLayout";
import { PasswordStrength } from "../../components/PasswordStrength";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";

const Auth: React.FC = () => {
  const [userType, setUserType] = useState<"user" | "artist">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (
    e: React.FormEvent,
    formType: "login" | "signup",
  ) => {
    e.preventDefault();
    setError("");

    if (!email) {
      const msg = "Please enter your email address.";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (formType === "login" && !password) {
      const msg = "Please enter your password.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsLoading(true);
    toast.info("Sending OTP...");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setOtpSent(true);
    toast.success("OTP sent successfully!");
    toast.info("For this demo, please use: 123456");
  };

  const handleResendOtp = (
    e: React.FormEvent,
    formType: "login" | "signup",
  ) => {
    setOtp("");
    handleSendOtp(e, formType);
  };

  const handleVerify = (e: React.FormEvent, formType: "login" | "signup") => {
    e.preventDefault();
    setError("");

    if (otp === "123456") {
      setIsVerified(true);
      toast.success("Email verified successfully!");
      if (formType === "login") {
        login(userType);
        navigate(`/dashboard/${userType}`);
      }
    } else {
      const msg = "Invalid OTP. Please try again.";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password || !confirmPassword) {
      const msg = "Please fill in all fields";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (password !== confirmPassword) {
      const msg = "Passwords do not match";
      setError(msg);
      toast.error(msg);
      return;
    }

    toast.success("Account created successfully!");
    login(userType);
    navigate(`/dashboard/${userType}`);
  };

  const onTabChange = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setOtp("");
    setOtpSent(false);
    setIsVerified(false);
  };

  const UserTypeSelector = ({
    formType,
    disabled,
  }: {
    formType: "login" | "signup";
    disabled?: boolean;
  }) => (
    <RadioGroup
      value={userType}
      onValueChange={(v) => setUserType(v as "user" | "artist")}
      className="grid grid-cols-2 gap-4"
      disabled={disabled}
    >
      <div>
        <RadioGroupItem
          value="user"
          id={`user-${formType}`}
          className="peer sr-only"
          disabled={disabled}
        />
        <Label
          htmlFor={`user-${formType}`}
          className={cn(
            "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
            userType === "user" && "border-neon-teal",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          User
        </Label>
      </div>
      <div>
        <RadioGroupItem
          value="artist"
          id={`artist-${formType}`}
          className="peer sr-only"
          disabled={disabled}
        />
        <Label
          htmlFor={`artist-${formType}`}
          className={cn(
            "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
            userType === "artist" && "border-neon-violet",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          Artist
        </Label>
      </div>
    </RadioGroup>
  );

  return (
    <AuthLayout>
      <Tabs
        defaultValue="login"
        className="w-[400px]"
        onValueChange={onTabChange}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card
            className={cn(
              "border-2",
              userType === "user"
                ? "border-neon-teal/30"
                : "border-neon-violet/30",
            )}
          >
            <CardHeader className="text-center">
              <CardTitle>Welcome Back!</CardTitle>
              <CardDescription>
                Select your role and enter your details to login.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <UserTypeSelector formType="login" disabled={otpSent} />
              <div className="space-y-2">
                <Label htmlFor="email-login">Email</Label>
                <Input
                  id="email-login"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={otpSent}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-login">Password</Label>
                <Input
                  id="password-login"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={otpSent}
                />
              </div>
              {otpSent && !isVerified && (
                <div className="space-y-2">
                  <Label htmlFor="otp-login">Enter OTP</Label>
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <Button
                    variant="link"
                    onClick={(e) => handleResendOtp(e, "login")}
                    className="p-0"
                  >
                    Resend OTP
                  </Button>
                </div>
              )}
              {isVerified && (
                <p className="text-green-500 text-sm text-center">
                  Email verified successfully! You can now login.
                </p>
              )}
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
            </CardContent>
            <CardFooter>
              {!otpSent ? (
                <Button
                  onClick={(e) => handleSendOtp(e, "login")}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send OTP & Login"}
                </Button>
              ) : (
                <Button
                  onClick={(e) => handleVerify(e, "login")}
                  className="w-full"
                >
                  Verify & Login
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card
            className={cn(
              "border-2",
              userType === "user"
                ? "border-neon-teal/30"
                : "border-neon-violet/30",
            )}
          >
            <CardHeader className="text-center">
              <CardTitle>Create an Account</CardTitle>
              <CardDescription>
                Select your role and enter your details to sign up.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <UserTypeSelector formType="signup" />
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input
                  id="password-signup"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <PasswordStrength password={password} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password-signup">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password-signup"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSignup} className="w-full">
                Create Account
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
};

export default Auth;
