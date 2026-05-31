# Mobile Certificates Center Alignment Summary

## Issue

On phone/mobile widths, the certificate cards in the static grid looked slightly left-aligned instead of visually centered.

## Root Cause

The mobile certificates layout in `app/(public)/components/certificates.tsx` used a grid container without explicit horizontal item alignment, while each `CertificateCard` had a constrained width (`min-w-[280px] max-w-[320px]`) in `components/ui/certificate-card.tsx`.

This combination meant the card width did not stretch to the full grid track, so the card could appear anchored toward the start edge of the grid area on mobile.

## Fix

- Add centered grid-item alignment for the mobile certificates grid.
- Wrap each mobile certificate card in a width-constrained container so the card centers consistently within the grid track.
- Keep the desktop `LogoLoop` path unchanged.

## Files Changed

- `app/(public)/components/certificates.tsx`

## Verification

Recommended verification after the change:

- `pnpm lint`
- `pnpm type-check`
- `pnpm build`

## Expected Result

- Single-column mobile cards are visually centered.
- Two-column small-tablet/mobile cards remain evenly aligned.
- Desktop certificate carousel behavior remains unchanged.
