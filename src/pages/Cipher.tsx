import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Cipher = () => {
  const [message, setMessage] = useState("");
  const [shift, setShift] = useState(3);
  const [result, setResult] = useState("");

  // Caesar cipher implementation using modular arithmetic
  const caesarCipher = (text: string, shiftValue: number, decrypt: boolean = false) => {
    const effectiveShift = decrypt ? -shiftValue : shiftValue;
    
    return text
      .split("")
      .map((char) => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          const isUpperCase = code >= 65 && code <= 90;
          const base = isUpperCase ? 65 : 97;
          
          // Apply modular arithmetic: (x + shift) mod 26
          const newCode = ((code - base + effectiveShift) % 26 + 26) % 26 + base;
          return String.fromCharCode(newCode);
        }
        return char;
      })
      .join("");
  };

  const handleEncrypt = () => {
    if (!message.trim()) {
      toast.error("Please enter a message to encrypt");
      return;
    }
    const encrypted = caesarCipher(message, shift);
    setResult(encrypted);
    toast.success("Message encrypted!");
  };

  const handleDecrypt = () => {
    if (!message.trim()) {
      toast.error("Please enter a message to decrypt");
      return;
    }
    const decrypted = caesarCipher(message, shift, true);
    setResult(decrypted);
    toast.success("Message decrypted!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            Modular Arithmetic Cipher
          </h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Theory Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Caesar Cipher Theory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">What is the Caesar Cipher?</h3>
                    <p className="text-muted-foreground">
                      The Caesar cipher is one of the earliest known encryption techniques, 
                      named after Julius Caesar who used it in his correspondence. It's a 
                      substitution cipher where each letter is shifted by a fixed number of 
                      positions in the alphabet.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Modular Arithmetic</h3>
                    <p className="text-muted-foreground mb-3">
                      The cipher uses modular arithmetic to wrap around the alphabet:
                    </p>
                    <div className="bg-secondary p-4 rounded-lg space-y-2 font-mono text-sm">
                      <p>Encryption: E(x) = (x + k) mod 26</p>
                      <p>Decryption: D(x) = (x - k) mod 26</p>
                    </div>
                    <p className="text-muted-foreground mt-3">
                      where x is the letter position (A=0, B=1, ..., Z=25) and k is the shift value.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Example</h3>
                    <p className="text-muted-foreground">
                      With a shift of 3:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground">
                      <li>A → D</li>
                      <li>B → E</li>
                      <li>X → A (wraps around)</li>
                      <li>HELLO → KHOOR</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Security Note</h3>
                    <p className="text-muted-foreground text-sm">
                      The Caesar cipher is not secure by modern standards as there are only 25 
                      possible keys. It's easily broken by frequency analysis or brute force. 
                      This demonstration is for educational purposes only.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cipher Tool</CardTitle>
                  <CardDescription>
                    Enter your message and choose a shift value to encrypt or decrypt
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Enter your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shift">Shift Value (k)</Label>
                    <Input
                      id="shift"
                      type="number"
                      min="1"
                      max="25"
                      value={shift}
                      onChange={(e) => setShift(parseInt(e.target.value) || 0)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Choose a number between 1 and 25
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleEncrypt} className="flex-1">
                      Encrypt
                    </Button>
                    <Button onClick={handleDecrypt} variant="secondary" className="flex-1">
                      Decrypt
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle>Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={result}
                      readOnly
                      className="min-h-[100px] font-mono"
                    />
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Mathematical Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold mb-1">Current Shift: {shift}</p>
                    <p className="text-sm text-muted-foreground">
                      Each letter is shifted {shift} position{shift !== 1 ? "s" : ""} in the alphabet
                    </p>
                  </div>
                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="text-sm font-mono">
                      Encryption formula:<br />
                      position' = (position + {shift}) mod 26
                    </p>
                  </div>
                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="text-sm font-mono">
                      Decryption formula:<br />
                      position' = (position - {shift}) mod 26
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cipher;
