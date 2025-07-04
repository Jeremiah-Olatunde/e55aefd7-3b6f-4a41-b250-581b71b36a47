import * as E from "fp-ts/Either";
import * as RA from "fp-ts/ReadonlyArray";
import * as F from "fp-ts/function";
import * as S from "fp-ts/string";

import { getSupportedRegionCodes, parsePhoneNumber } from "awesome-phonenumber";

export type Telephone = {
  alpha2: string;
  e164: string;
  input: string;
  itu: number;
  national: string;
};

export type ErrorTelephone =
  | ErrorAlpha2Mismatch
  | ErrorInvalidAlpha2
  | ErrorInvalidCharacters
  | ErrorInvalidNumber;

type ErrorInvalidAlpha2 = Readonly<{
  tag: "ErrorInvalidAlpha2";
  input: string;
}>;

type ErrorInvalidCharacters = Readonly<{
  input: string;
  chars: readonly string[];
  tag: "ErrorInvalidCharacters";
}>;

type ErrorAlpha2Mismatch = Readonly<{
  input: string;
  desired: string;
  reality: string;
  tag: "ErrorAlpha2Mismatch";
}>;

type ErrorInvalidNumber = Readonly<{
  input: string;
  tag: "ErrorInvalidNumber";
}>;

export function validateAlpha2(alpha2: string): boolean {
  const supportedAlpha2 = RA.fromArray(getSupportedRegionCodes());
  return RA.elem(S.Eq)(alpha2)(supportedAlpha2);
}

export function validateOnlyDigitsAndWhitespace(
  input: string,
): E.Either<ErrorInvalidCharacters, string> {
  const regex = /[^(\d|\s)]/gm;
  const matches = input.match(regex);

  if (matches === null) {
    return E.right(input);
  }

  const tag = "ErrorInvalidCharacters";
  const chars = RA.fromArray(matches);
  return E.left({ chars, input, tag });
}

export function validateTelephone(alpha2: string) {
  return function (
    input: string,
  ): E.Either<ErrorInvalidAlpha2 | ErrorInvalidNumber, Telephone> {
    const parsed = parsePhoneNumber(input, { regionCode: alpha2 });

    if (parsed.valid) {
      const itu = parsed.countryCode;
      const e164 = parsed.number.e164;
      const national = parsed.number.national;
      return E.right({ input, alpha2, itu, e164, national });
    }

    const tag = "ErrorInvalidNumber";
    return E.left({ input, tag });
  };
}

export function validateMatchingAlpha2(alpha2: string) {
  return function (
    telephone: Telephone,
  ): E.Either<ErrorAlpha2Mismatch, Telephone> {
    if (alpha2 !== telephone.alpha2) {
      const tag = "ErrorAlpha2Mismatch";
      const desired = alpha2;
      const reality = telephone.alpha2;
      const input = telephone.input;
      return E.left({ tag, desired, reality, input });
    }

    return E.right(telephone);
  };
}

const ErrorIA2 = (input: string) => ({
  input,
  tag: "ErrorInvalidAlpha2" as const,
});

export function parseTelephone(input: string) {
  return function (alpha2: string): E.Either<ErrorTelephone, Telephone> {
    return F.pipe(
      E.of(input),
      E.tap(() => F.pipe(alpha2, E.fromPredicate(validateAlpha2, ErrorIA2))),
      E.flatMap(validateOnlyDigitsAndWhitespace),
      E.flatMap(validateTelephone(alpha2)),
      E.flatMap(validateMatchingAlpha2(alpha2)),
    );
  };
}
