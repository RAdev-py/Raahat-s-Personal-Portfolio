# BPCS Steganography

### Naveed Razzaque & Raahat Amin
       
### Project Description:

This project implements **Bit-Plane Complexity Segmentation (BPCS) Steganography** — a technique for hiding files invisibly inside PNG images.

Unlike the common Least Significant Bit (LSB) approach, which makes a tiny modification to every pixel and leaves a detectable statistical fingerprint, BPCS identifies regions of the image that already appear visually complex (noise-like) and completely overwrites those regions with the hidden data. Because changes only occur in areas that look like noise to begin with, the encoded image is visually indistinguishable from the original, and no histogram-based detection technique can flag it.
  
### Instructions:

### Requirements

- [Processing 4](https://processing.org/download) — free, no additional libraries needed

---

### Setup

1. Open `BPCS.pde` in Processing
2. Place any files you want to encode or decode into the sketch's `data` folder
3. Run the sketch — the GUI will open in a new window

---

### Encoding (hiding a file inside an image)

1. Navigate to the **Encode** tab
2. Type the filename of your vessel image into the vessel field (e.g. `flamingos.png`)
3. Type the filename of the file you want to hide into the payload field (e.g. `payload.png`)
4. Click **Encode** — the program will process and save the encoded image to the `data` folder

---

### Decoding (recovering a hidden file)

1. Navigate to the **Decode** tab
2. Type the filename of the encoded image into the input field (e.g. `flamingos_encoded.png`)
3. Click **Decode** — the recovered file will be saved to the `data` folder under its original filename

---

### Info Tab

The **Info** tab displays statistics about the loaded vessel image:
- Total number of embeddable 8×8 blocks across all 24 bit planes
- Maximum file capacity in bytes

---

### Bit Plane Viewer

The **Bit Plane** tab lets you visualise the vessel image's bit plane decomposition. Select a colour channel (R, G, or B) and a bit plane level (0–7) to see the corresponding binary image. This is useful for understanding which regions the encoder identifies as complex.

---

## BPCS in a Nutshell

Instead of touching every pixel a tiny amount:
Find specific regions that already look like noise, and **completely overwrite them**

- Changes in a noisy region are invisible — you can't tell noise from different noise
- Higher capacity, harder to detect statistically

---

## Bit Planes

Split any image into 24 binary (black & white) images:
- 8 bit planes per colour channel (R, G, B)
- Each plane shows one bit of every pixel

| Plane | What it looks like |
|---|---|
| Most significant (bit 7) | Resembles the original image |
| Mid planes (bits 3–5) | Partial structure + noise |
| Least significant (bit 0) | Looks like pure static |

**Key insight:** In textured areas, even the mid and high bit planes contain 8×8 patches that look like random noise. These are the embedding targets.

---

## Complexity: The Alpha Measure

For each 8×8 block in a bit plane, count how often adjacent pixels differ (black→white or white→black) across all rows and columns.

$$\alpha = \frac{\text{total transitions}}{2 \times 8 \times 7}$$

- **α = 0** → completely smooth (all black or all white)
- **α = 1** → checkerboard — maximum transitions possible
- **Threshold = 0.3** — blocks above this are marked *complex*

We build a **complexity map** for each bit plane: a grid of 1s (complex) and 0s (simple).

**Only complex blocks are used for embedding** — simple blocks are left completely untouched.

---

## The Hamming Cliff Problem

Binary representation causes a problem at the boundary between 127 and 128:

```
127 → 0 1 1 1 1 1 1 1   (standard binary)
128 → 1 0 0 0 0 0 0 0
```

Every single bit flips — so a smooth gradient crossing this boundary looks like a hard edge across all 8 bit planes at once. Our complexity map would wrongly flag those regions as complex.

**Fix: Gray Code**

In Gray code, consecutive numbers always differ by exactly **one bit**:

```
127 → 0 1 0 0 0 0 0 0   (Gray code)
128 → 1 1 0 0 0 0 0 0
```

Visually smooth areas stay smooth in the bit planes. Genuinely noisy areas are the ones that look complex.

We convert every pixel to Gray code before decomposing into bit planes, embed the data, then convert back. The decoder does the same in reverse.

---

## Conjugation

A problem: some blocks of payload data are themselves simple (e.g. a run of zero bytes). Writing them into a complex block makes that block simple — the decoder won't know to look there.

**Solution: conjugation**

XOR the block with a checkerboard pattern (the most complex possible block, α = 1).

If a block has complexity α, its conjugate has complexity **1 − α**.

So any simple block can be flipped into a complex one. We store a 1-bit flag per block recording whether it was conjugated. The decoder XORs again with the same checkerboard to undo it.

The **conjugation map** (one bit per embedded block) is stored in the least significant red bit plane before anything else.

---

## Embedding: Step by Step

1. Load vessel image → convert to Gray code
2. Decompose into 24 bit planes (8 per channel)
3. Compute complexity map for each bit plane using α
4. Prepend a file header to the payload (stores filename + file size)
5. Iterate through complex blocks, writing 64 bits of payload per block
6. After writing each block: if α ≤ threshold, conjugate it and record `true` in the conjugation map; otherwise record `false`
7. Embed the conjugation map into red bit plane 0
8. Reassemble bit planes → convert Gray code back to binary → save

**Block order:** we process all three colour channels at each bit-plane level before moving up, so data is spread evenly rather than filling one channel first.

---

## Decoding: Step by Step

1. Load encoded image → convert to Gray code
2. Decompose into 24 bit planes, compute same complexity maps with same threshold
3. Read conjugation map from red bit plane 0
4. Iterate complex blocks in same order as encoder:
   - If conjugation flag is `true`, XOR with checkerboard to undo it
   - Read 64 bits
5. First bytes = file header → extract filename and file size
6. Read exactly that many bytes → save recovered file

The recovered file is **bit-for-bit identical** to the original.

---

## Summary

| Step | What happens |
|---|---|
| Gray code | Fix the Hamming cliff so bit planes reflect visual structure |
| Bit plane decomposition | Split image into 24 binary images |
| Complexity mapping | Identify 8×8 blocks with α > 0.4 |
| Embedding | Write payload bits directly into complex blocks |
| Conjugation | Flip simple payload blocks to be complex; record which ones |
| Reassembly | Rebuild image, convert back to standard binary |
| Decoding | Reverse the whole process using the same complexity map |

---

### Resources/ References:

- Kawaguchi, E. & Eason, R. O. (1998). *Principle and Applications of BPCS Steganography.* SPIE International Symposium on Voice, Video and Data Communications.
- Srinivasan, Y. (2003). *High Capacity Data Hiding System Using BPCS Steganography.* Master's thesis, Texas Tech University.
- Gonzalez, R. C. & Woods, R. E. (2002). *Digital Image Processing* (2nd ed.). Pearson Education.
- [Processing Foundation](https://processing.org) — programming environment and documentation
- [Wikipedia: Gray code](https://en.wikipedia.org/wiki/Gray_code)
- [Wikipedia: Peak signal-to-noise ratio](https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio)
- [Wikipedia: Steganography](https://en.wikipedia.org/wiki/Steganography)
