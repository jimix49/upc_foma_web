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
  const [a, setA] = useState(5);
  const [k, setK] = useState(8);
  const [result, setResult] = useState("");

  // Valid values for 'a' (coprime with 26)
  const validAValues = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

  // Modular multiplicative inverse
  const modInverse = (a: number, m: number): number => {
    for (let x = 1; x < m; x++) {
      if ((a * x) % m === 1) return x;
    }
    return 1;
  };

  // Affine cipher implementation: C(x) = (ax + k) mod 26
  const affineCipher = (text: string, aValue: number, kValue: number, decrypt: boolean = false) => {
    if (!validAValues.includes(aValue)) {
      return text;
    }

    return text
      .split("")
      .map((char) => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0);
          const isUpperCase = code >= 65 && code <= 90;
          const base = isUpperCase ? 65 : 97;
          const x = code - base;
          
          let newX;
          if (decrypt) {
            // D(x) = a^(-1)(x - k) mod 26
            const aInv = modInverse(aValue, 26);
            newX = (aInv * (x - kValue + 26)) % 26;
          } else {
            // C(x) = (ax + k) mod 26
            newX = (aValue * x + kValue) % 26;
          }
          
          return String.fromCharCode(newX + base);
        }
        return char;
      })
      .join("");
  };

  const handleEncrypt = () => {
    if (!message.trim()) {
      toast.error("Si us plau, introdueix un missatge per xifrar");
      return;
    }
    if (!validAValues.includes(a)) {
      toast.error("El valor de 'a' ha de ser coprimer amb 26");
      return;
    }
    const encrypted = affineCipher(message, a, k);
    setResult(encrypted);
    toast.success("Missatge xifrat!");
  };

  const handleDecrypt = () => {
    if (!message.trim()) {
      toast.error("Si us plau, introdueix un missatge per desxifrar");
      return;
    }
    if (!validAValues.includes(a)) {
      toast.error("El valor de 'a' ha de ser coprimer amb 26");
      return;
    }
    const decrypted = affineCipher(message, a, k, true);
    setResult(decrypted);
    toast.success("Missatge desxifrat!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            Xifrat amb Aritmètica Modular
          </h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Theory Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Teoria del Xifrat Afí</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Què és el xifrat afí?</h3>
                    <p className="text-muted-foreground">
                      El xifrat afí és un tipus de xifratge per substitució monoalfabètica 
                      que combina multiplicació i desplaçament. Cada lletra es transforma 
                      mitjançant una funció afí sobre l'aritmètica modular.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Aritmètica Modular</h3>
                    <p className="text-muted-foreground mb-3">
                      El xifrat utilitza aritmètica modular per transformar les lletres:
                    </p>
                    <div className="bg-secondary p-4 rounded-lg space-y-2 font-mono text-sm">
                      <p>Xifratge: C(x) = (ax + k) mod 26</p>
                      <p>Desxifratge: D(x) = a⁻¹(x - k) mod 26</p>
                    </div>
                    <p className="text-muted-foreground mt-3">
                      on x és la posició de la lletra (A=0, B=1, ..., Z=25), 'a' i 'k' són les claus, 
                      i 'a' ha de ser coprimer amb 26.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Valors vàlids per 'a'</h3>
                    <p className="text-muted-foreground">
                      El valor de 'a' ha de ser coprimer amb 26 (MCD(a,26) = 1):
                    </p>
                    <div className="bg-secondary p-3 rounded-lg mt-2 font-mono text-sm">
                      <p>a ∈ {"{1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25}"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Exemple</h3>
                    <p className="text-muted-foreground">
                      Amb a=5 i k=8:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground">
                      <li>A (0) → I (8)</li>
                      <li>B (1) → N (13)</li>
                      <li>HOLA → HSZI</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Nota de seguretat</h3>
                    <p className="text-muted-foreground text-sm">
                      El xifrat afí no és segur segons els estàndards moderns, ja que només hi ha 
                      312 claus possibles. És vulnerable a atacs d'anàlisi de freqüències. 
                      Aquesta demostració és només amb finalitats educatives.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Eina de Xifratge</CardTitle>
                  <CardDescription>
                    Introdueix el teu missatge i tria els valors de 'a' i 'k' per xifrar o desxifrar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message">Missatge</Label>
                    <Textarea
                      id="message"
                      placeholder="Introdueix el teu missatge aquí..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="a">Valor de 'a'</Label>
                      <Input
                        id="a"
                        type="number"
                        value={a}
                        onChange={(e) => setA(parseInt(e.target.value) || 1)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Ha de ser coprimer amb 26
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="k">Valor de 'k'</Label>
                      <Input
                        id="k"
                        type="number"
                        min="0"
                        max="25"
                        value={k}
                        onChange={(e) => setK(parseInt(e.target.value) || 0)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Entre 0 i 25
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleEncrypt} className="flex-1">
                      Xifrar
                    </Button>
                    <Button onClick={handleDecrypt} variant="secondary" className="flex-1">
                      Desxifrar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle>Resultat</CardTitle>
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
                  <CardTitle>Procés Matemàtic</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold mb-1">Valors actuals: a={a}, k={k}</p>
                    <p className="text-sm text-muted-foreground">
                      Cada lletra es transforma segons la funció afí amb aquests paràmetres
                    </p>
                  </div>
                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="text-sm font-mono">
                      Fórmula de xifratge:<br />
                      C(x) = ({a}x + {k}) mod 26
                    </p>
                  </div>
                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="text-sm font-mono">
                      Fórmula de desxifratge:<br />
                      D(x) = {modInverse(a, 26)}(x - {k}) mod 26
                    </p>
                  </div>
                  {!validAValues.includes(a) && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
                      ⚠️ El valor de 'a' no és vàlid. Ha de ser un dels següents: {validAValues.join(", ")}
                    </div>
                  )}
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
