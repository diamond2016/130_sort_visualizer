
### Idea di base del radix sort

Radix sort è un algoritmo di ordinamento **non basato su confronti**: invece di confrontare direttamente i numeri tra loro, li ordina **digit per digit** (cifra per cifra).

Di solito si usa la variante **LSD (Least Significant Digit)**, cioè:

1. **Trova il numero con più cifre** nell’array.
2. **Ordina i numeri in base alla cifra delle unità** (10⁰).
3. Poi **in base alle decine** (10¹).
4. Poi **in base alle centinaia** (10²).
5. …e così via, finché hai processato tutte le cifre.

Per ordinare in base a una singola cifra, radix sort usa tipicamente **counting sort** come sotto-algoritmo, perché è:
- lineare,
- stabile (mantiene l’ordine relativo di elementi uguali).

---

### Come funziona passo per passo (LSD radix sort)

Supponiamo di avere l’array:

\[
[170,\ 45,\ 75,\ 90,\ 802,\ 24,\ 2,\ 66]
\]

#### 1. Trova il massimo

- **Scopo:** sapere quante cifre al massimo devi considerare.
- Il massimo è \(802\) → ha 3 cifre → farai 3 passaggi (unità, decine, centinaia).

#### 2. Passaggio sulle unità (exp = 1)

- Consideri la cifra delle unità di ogni numero:
  - 170 → 0  
  - 45 → 5  
  - 75 → 5  
  - 90 → 0  
  - 802 → 2  
  - 24 → 4  
  - 2 → 2  
  - 66 → 6  

- Li distribuisci in “bucket” (0–9) in base a quella cifra, mantenendo l’ordine.
- Ricombini i bucket in un unico array ordinato per unità.

#### 3. Passaggio sulle decine (exp = 10)

- Ora guardi la cifra delle decine:
  - 170 → 7  
  - 45 → 4  
  - 75 → 7  
  - 90 → 9  
  - 802 → 0  
  - 24 → 2  
  - 2 → 0  
  - 66 → 6  

- Di nuovo, counting sort sulla cifra delle decine, poi ricombini.

#### 4. Passaggio sulle centinaia (exp = 100)

- Cifra delle centinaia:
  - 170 → 1  
  - 45 → 0  
  - 75 → 0  
  - 90 → 0  
  - 802 → 8  
  - 24 → 0  
  - 2 → 0  
  - 66 → 0  

- Counting sort sulla cifra delle centinaia, ricombini.

Alla fine di questi passaggi, l’array risulta ordinato in modo crescente.

---

### Complessità

- **Tempo:** \(O(n \cdot k)\)  
  - \(n\) = numero di elementi  
  - \(k\) = numero di cifre del numero più grande  
- **Spazio:** \(O(n + b)\)  
  - \(b\) = base (per i decimali è 10, perché cifre 0–9)

È molto efficiente quando:
- i numeri hanno **lunghezza limitata** (k piccolo),
- lavori con **molti interi**.

---

### Implementazione in Java (LSD radix sort con counting sort)

Ecco un esempio completo e pulito:

```java
import java.util.Arrays;

public class RadixSort {

    // Trova il massimo nell'array per sapere quante cifre considerare
    private static int getMax(int[] arr) {
        int max = arr[0];
        for (int num : arr) {
            if (num > max) {
                max = num;
            }
        }
        return max;
    }

    // Counting sort in base alla cifra indicata da exp (1, 10, 100, ...)
    private static void countingSort(int[] arr, int exp) {
        int n = arr.length;
        int[] output = new int[n];   // array di uscita
        int[] count = new int[10];   // contatore per cifre 0-9

        // Inizializza count a 0
        Arrays.fill(count, 0);

        // Conta le occorrenze di ogni cifra
        for (int i = 0; i < n; i++) {
            int digit = (arr[i] / exp) % 10;
            count[digit]++;
        }

        // Trasforma count in posizioni cumulative
        // count[i] conterrà la posizione finale dell'ultima occorrenza di i
        for (int i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        // Costruisci l'array di output (iterando da destra per mantenere stabilità)
        for (int i = n - 1; i >= 0; i--) {
            int digit = (arr[i] / exp) % 10;
            output[count[digit] - 1] = arr[i];
            count[digit]--;
        }

        // Copia l'output nell'array originale
        System.arraycopy(output, 0, arr, 0, n);
    }

    // Radix sort principale
    public static void radixSort(int[] arr) {
        if (arr == null || arr.length == 0) {
            return;
        }

        // Trova il massimo per sapere quante cifre processare
        int max = getMax(arr);

        // Per ogni cifra (unità, decine, centinaia, ...) applica counting sort
        for (int exp = 1; max / exp > 0; exp *= 10) {
            countingSort(arr, exp);
        }
    }

    // Esempio d'uso
    public static void main(String[] args) {
        int[] data = {170, 45, 75, 90, 802, 24, 2, 66};

        System.out.println("Array originale: " + Arrays.toString(data));
        radixSort(data);
        System.out.println("Array ordinato:  " + Arrays.toString(data));
    }
}
```
Perfetto Riccardo — ti preparo **la versione completa del radix sort con bucket espliciti**, così puoi vedere chiaramente *come avviene la ricombinazione* senza passare dal counting sort.  
È il modo più intuitivo per capire davvero il meccanismo interno.

---

## 🔧 Radix Sort LSD con bucket espliciti (Java)

### ✔️ Caratteristiche di questa versione
- Usa **10 bucket** (0–9), ognuno una `List<Integer>`.
- Distribuisce gli elementi nei bucket in base alla cifra corrente.
- Ricombina i bucket nell’array originale **in ordine crescente di bucket**.
- È estremamente leggibile e didattico.

---

## 📌 Codice Java completo

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class RadixSortBuckets {

    // Funzione principale
    public static void radixSort(int[] arr) {
        if (arr == null || arr.length == 0) return;

        // Trova il massimo per sapere quante cifre servono
        int max = Arrays.stream(arr).max().getAsInt();

        // exp = 1 → unità, 10 → decine, 100 → centinaia...
        for (int exp = 1; max / exp > 0; exp *= 10) {
            bucketSortByDigit(arr, exp);
        }
    }

    // Ordinamento per una singola cifra usando bucket espliciti
    private static void bucketSortByDigit(int[] arr, int exp) {
        // 10 bucket: 0–9
        List<List<Integer>> buckets = new ArrayList<>(10);
        for (int i = 0; i < 10; i++) {
            buckets.add(new ArrayList<>());
        }

        // Distribuzione nei bucket
        for (int num : arr) {
            int digit = (num / exp) % 10;
            buckets.get(digit).add(num);
        }

        // Ricombinazione
        int index = 0;
        for (int i = 0; i < 10; i++) {
            for (int num : buckets.get(i)) {
                arr[index++] = num;
            }
        }
    }

    // Esempio d'uso
    public static void main(String[] args) {
        int[] data = {170, 45, 75, 90, 802, 24, 2, 66};

        System.out.println("Originale: " + Arrays.toString(data));
        radixSort(data);
        System.out.println("Ordinato:  " + Arrays.toString(data));
    }
}
```

---

## 🔍 Focus: la ricombinazione dai bucket

La parte chiave è questa:

```java
int index = 0;
for (int i = 0; i < 10; i++) {
    for (int num : buckets.get(i)) {
        arr[index++] = num;
    }
}
```

### Cosa succede esattamente?

1. **Si parte dal bucket 0**  
   → tutti i numeri con cifra corrente = 0 vengono copiati nell’array.

2. **Poi bucket 1**  
   → si appendono i numeri con cifra = 1.

3. **Bucket 2, 3, … fino a 9**  
   → concatenazione lineare.

### Perché funziona?

- Ogni bucket rappresenta una “classe” di elementi con la stessa cifra.
- Concatenare i bucket in ordine crescente equivale a ordinare per quella cifra.
- L’ordine interno dei bucket è **stabile**, quindi non si perde l’ordinamento delle cifre precedenti.

---

## 🎯 Visualizzazione intuitiva

Immagina i bucket come **cassettini**:





- Metti ogni numero nel cassetto corrispondente alla cifra.
- Poi svuoti i cassetti **dal primo all’ultimo**.
- L’array risultante è ordinato per quella cifra.

---

## Vuoi anche la versione:
- **MSD (Most Significant Digit)**?  
- **Supporto ai numeri negativi**?  
- **Radix sort per stringhe** (caratteri)?  

Scegli tu:  
👉 Radix sort MSD  
👉 Radix sort con negativi  
👉 Radix sort per stringhe


A python example
```python
def radix_sort(arr):
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:          # one pass per digit
        # counting sort by (x // exp) % 10, stable
        out = [0] * len(arr)
        count = [0] * 10
        for x in arr:
            count[(x // exp) % 10] += 1
        for i in range(1, 10):
            count[i] += count[i - 1]
        for x in reversed(arr):        # reversed keeps it stable
            d = (x // exp) % 10
            count[d] -= 1
            out[count[d]] = x
        arr = out
        exp *= 10
    return arr

print(radix_sort([45, 23, 8, 67, 12]))  # [8, 12, 23, 45, 67]
```
